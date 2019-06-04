import { Component } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import { EChartOption, graphic } from 'echarts';
import { ActivatedRoute, Params } from '@angular/router';

import { PortfolioService } from '../../services/portfolio.service';
import { Strategy } from '../../models/Strategy';
import { RSIStrategy } from '../../models/strategies/RSIStrategy';
import { StrategicDecision } from '../../models/StragegicDecision';
import { Stock } from '../../models/Stock';
import { Marker } from '../../models/Marker';
import { Symbol } from '../../models/Symbol';
import { RSIWithSMAStrategy } from 'src/app/models/strategies/RSIWithSMAStrategy';

import { SymbolsService } from '../../services/symbols.service';
import { StrategiesService } from 'src/app/services/strategies.service';
import { RSIStrategy_33_66 } from 'src/app/models/strategies/RSIStrategy_33_66';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    title                             = 'backtest-app';
    subject:     WebSocketSubject<{}> = webSocket('ws://localhost:8080');
    chartOption: EChartOption         = {};

    private _cash:               number;
    private _stocks:             {[key: string]: Stock };
    public  _currentStockSymbol: Symbol;
    public  _symbols:            Symbol[];
    public  _currentStrategy:    string;
    public  _strategies:         string[];

    constructor (
        private _portfolioService:  PortfolioService,
        private _symbolsService:    SymbolsService,
        private _strategiesService: StrategiesService,
        private _activatedRoute:    ActivatedRoute
    ) {

        this._activatedRoute.params.subscribe(( params: Params ) => {
            if ( params.symbol ) {
                console.log( `Setting symbol to ${params.symbol}` );
                this._symbolsService.setCurrentSymbol({
                    name: '',
                    symbol: params.symbol
                });
            }
        });

        this._symbolsService.currentSymbol.subscribe(( symbol: Symbol ) => {
            console.log( `Got update ${symbol.symbol}` );
            this._currentStockSymbol = symbol;
            this.subject.next({
                command: 'GET_QUOTE',
                options: {
                    quote: this._currentStockSymbol.symbol
                }
            });
        });

        this._strategiesService.currentStrategy.subscribe(( strategy: string ) => {
            this._currentStrategy = strategy;
        });

        this._strategiesService.strategies.subscribe(( strategies: string[] ) => {
            this._strategies = strategies;
        });

        this._symbolsService.symbols.subscribe(( symbols: Symbol[] ) => {
            this._symbols = symbols;
        });

        this._portfolioService.cash.subscribe(( cash: number ) => {
            this._cash = cash;
            console.log( `Cash remaining: ${this._cash}` );
        });

        this._portfolioService.stocks.subscribe(( stocks: {[key: string]: Stock }) => {
            this._stocks = stocks;
        });

        this.subject.subscribe(
            ( msg: any ) => {
                console.log( 'message received', msg );
                const open:      number[]   = [];
                const date:      string[]   = [];
                const sma12:     number[]   = [];
                const sma26:     number[]   = [];
                const ohlc:      number[][] = [];
                const volumes:   number[]   = [];
                const rsi:       number[]   = [];
                const rsiTop:    number[]   = [];
                const rsiLow:    number[]   = [];
                const rsiMiddle: number[]   = [];
                const macd: {
                    short:  number[],
                    long:   number[],
                    signal: number[]
                } = {
                    short:  [],
                    long:   [],
                    signal: []
                };
                const markers:  Marker[] = [];
                const strategies: {[key: string]: Strategy } = {
                    rsiStrategy: new RSIStrategy( 'RSI Strategy' )
                };
                msg._quotes.forEach( element => {
                    const parsedDate:    Date   = new Date( element.date );
                    const parsedHours:   string =
                        parsedDate.getHours() > 9 ? parsedDate.getHours() + '' :
                                                    '0' + parsedDate.getHours();
                    const parsedMinutes: string =
                        parsedDate.getMinutes() > 9 ? parsedDate.getMinutes() + '' :
                                                      '0' + parsedDate.getMinutes();
                    const transformedDate       = `${parsedHours}:${parsedMinutes}`;
                    open.push( element.open );
                    date.push( transformedDate );
                    sma12.push( element.sma_12_0 );
                    sma26.push( element.sma_26_0 );
                    ohlc.push([ element.open, element.high, element.low, element.close ]);
                    volumes.push( element.volume );
                    rsi.push( element.rsi_14_0 );
                    rsiTop.push( 70 );
                    rsiLow.push( 30 );
                    rsiMiddle.push( 50 );
                    macd.short.push( element.macd_2_5_9_0 );
                    macd.long.push( element.macd_2_5_9_1 );
                    macd.signal.push( element.macd_2_5_9_2 );

                    // Try strategies
                    const data: {[key: string]: number | Date } = {
                        rsi:   element.rsi_14_0,
                        sma12: element.sma_12_0,
                        sma26: element.sma_26_0,
                        macd:  element.macd_2_5_9_1,
                        time:  parsedDate
                    };

                    let buyDecision:  StrategicDecision = null;
                    let sellDecision: StrategicDecision = null;

                    if ( this._currentStrategy === 'RSI' ) {
                        buyDecision  = RSIStrategy.shouldBuy( data );
                        sellDecision = RSIStrategy.shouldSell( data );
                    } else if ( this._currentStrategy === 'RSI 33/66' ) {
                        buyDecision  = RSIStrategy_33_66.shouldBuy( data );
                        sellDecision = RSIStrategy_33_66.shouldSell( data );
                    } else if ( this._currentStrategy === 'RSI + SMA' ) {
                        buyDecision  = RSIWithSMAStrategy.shouldBuy( data );
                        sellDecision = RSIWithSMAStrategy.shouldSell( data );
                    }

                    if ( buyDecision.decision && ( buyDecision.amount > 0 || buyDecision.amount === -1 )) {
                        const amount: number = Math.floor( this._cash / element.open );
                        if ( buyDecision.amount === -1 && amount > 0 ) {
                            this._portfolioService.buy( new Stock( this._currentStockSymbol.symbol, amount ), element.open );
                            markers.push({
                                name: `Buying ${amount} x ${this._currentStockSymbol.symbol} for ${element.open * amount} at ${transformedDate}`,
                                type: 'buy',
                                yAxis: element.open,
                                xAxis: transformedDate
                            });
                        } else if ( buyDecision.amount !== -1 ) {
                            this._portfolioService.buy( new Stock( this._currentStockSymbol.symbol, buyDecision.amount ), element.close );
                            markers.push({
                                name: `Buying ${buyDecision.amount} x ${this._currentStockSymbol.symbol} for ${element.open * buyDecision.amount} at ${transformedDate}`,
                                type: 'buy',
                                yAxis: element.open,
                                xAxis: transformedDate
                            });
                        }
                    }

                    if ( sellDecision.decision && ( sellDecision.amount > 0 || sellDecision.amount === -1 )) {
                        const amount: number = this._stocks[this._currentStockSymbol.symbol] ? this._stocks[this._currentStockSymbol.symbol].amount : 0;
                        if ( sellDecision.amount === -1 && amount > 0 ) {
                            this._portfolioService.sell( new Stock( this._currentStockSymbol.symbol, amount ), element.open );
                            markers.push({
                                name: `Selling ${amount} x ${this._currentStockSymbol} for ${element.open * amount} at ${transformedDate}`,
                                type: 'sell',
                                yAxis: element.open,
                                xAxis: transformedDate
                            });
                        } else if ( sellDecision.amount !== -1 ) {
                            this._portfolioService.sell( new Stock( this._currentStockSymbol.symbol, sellDecision.amount ), element.open );
                            markers.push({
                                name: `Selling ${sellDecision.amount} x ${this._currentStockSymbol.symbol} for ${element.open * sellDecision.amount} at ${transformedDate}`,
                                type: 'sell',
                                yAxis: element.open,
                                xAxis: transformedDate
                            });
                        }
                    }
                });
                this.chartOption = {
                    grid: [
                        {
                            show: false,
                            backgroundColor: '#f00',
                            left: '5%',
                            right: '5%',
                            height: '40%'
                        },
                        {
                            left: '5%',
                            right: '5%',
                            top: '55%',
                            height: '15%'
                        },
                        {
                            left: '5%',
                            right: '5%',
                            top: '70%',
                            height: '15%'
                        },
                        {
                            left: '5%',
                            right: '5%',
                            top: '85%',
                            height: '10%'
                        }
                    ],
                    backgroundColor: '#111',
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data: ['Dow-Jones index', 'sma_10', 'MA10', 'MA20', 'MA30'],
                        inactiveColor: '#003399',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        confine: true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 10,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisPointer: {
                        link: [{
                            xAxisIndex: [0, 1, 2, 3]
                        }],
                        type: 'shadow',
                        label: {
                            backgroundColor: '#0CF49B33',
                            shadowColor: '#0CF49B',
                            borderColor: '#000'
                        }
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: true,
                            },
                            brush: {
                                type: ['lineX', 'clear']
                            }
                        }
                    },
                    brush: {
                        xAxisIndex: 'all',
                        yAxisIndex: 'all',
                        brushStyle: {
                            borderWidth: 1,
                            color: 'rgba(255,140,180,0.3)',
                            borderColor: 'rgba(255,140,180,0.8)'
                        },
                        brushLink: 'all',
                        outOfBrush: {
                            colorAlpha: 1
                        }
                    },
                    xAxis: [
                        {
                            name : 'Time',
                            scale: true,
                            type: 'category',
                            data: date,
                            boundaryGap : true,
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgb(0,200,200)',
                                    opacity: 0.3
                                }
                            },
                            splitArea: {
                                show: false
                            },
                            axisLabel: {show: true},
                            splitNumber: 20,
                            axisLine: {
                                lineStyle: {
                                    color: '#8392A5'
                                },
                            }
                        },
                        {
                            type: 'category',
                            gridIndex: 1,
                            data: date,
                            scale: true,
                            boundaryGap : false,
                            axisLine: {onZero: false},
                            axisTick: {show: false},
                            splitLine: {show: false},
                            axisLabel: {show: false},
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                        },
                        {
                            type: 'category',
                            gridIndex: 2,
                            data: date,
                            scale: true,
                            boundaryGap : false,
                            axisLine: {onZero: false},
                            axisTick: {show: false},
                            splitLine: {show: false},
                            axisLabel: {show: false},
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                        },
                        {
                            type: 'category',
                            gridIndex: 3,
                            data: date,
                            scale: true,
                            boundaryGap : false,
                            axisLine: {onZero: false},
                            axisTick: {show: false},
                            splitLine: {show: false},
                            axisLabel: {show: false},
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                        }
                    ],
                    yAxis: [
                        {
                            name : 'Price ($)',
                            scale: true,
                            type: 'value',
                            splitArea: {
                                show: false
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8392A5'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#00ff99',
                                    opacity: 0.2
                                }
                            }
                       },
                       {
                            scale: true,
                            type: 'value',
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLabel: {show: true},
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8392A5'
                                }
                            },
                            axisTick: {show: true},
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#00ff99',
                                    opacity: 0.2
                                }
                            }
                        },
                        {
                            scale: true,
                            type: 'value',
                            gridIndex: 2,
                            splitNumber: 2,
                            axisLabel: {show: true},
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8392A5'
                                }
                            },
                            axisTick: {show: true},
                            splitLine: {
                                show: false
                            }
                        },
                        {
                            scale: true,
                            type: 'value',
                            gridIndex: 3,
                            splitNumber: 2,
                            axisLabel: {show: true},
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8392A5'
                                }
                            },
                            axisTick: {show: true},
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0, 1, 2, 3],
                            start: 0,
                            end: 100
                        }
                    ],
                    series: [
                        {
                            name: `${this._currentStockSymbol.symbol} day evolution`,
                            type: 'candlestick',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: ohlc,
                            itemStyle: {
                                normal: {
                                    width: 1,
                                    color: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#0CF49B'},
                                            {offset: 1, color: '#0CF49B33'}
                                        ]
                                    ),
                                    color0: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#FF105033'},
                                            {offset: 1, color: '#FF1050'}
                                        ]
                                    ),
                                    borderColor: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#0CF49B'},
                                            {offset: 1, color: '#0CF49B33'}
                                        ]
                                    ),
                                    borderColor0: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#FF105033'},
                                            {offset: 1, color: '#FF1050'}
                                        ]
                                    ),
                                }
                            },
                            markPoint: {
                                symbol: 'diamond',
                                symbolSize: 20,
                                symbolRotate: 45,
                                symbolOffset: [ 0, -40 ],
                                label: {
                                    color: '#fff',
                                    formatter: ( params ) => {
                                        return markers[params.dataIndex].type === 'buy' ? 'B' : 'S';
                                    },
                                    fontSize: '8',
                                    // fontWeight: '700'
                                },
                                itemStyle: {
                                    color: ( params ) => {
                                        if ( markers[params.dataIndex].type === 'buy' ) {
                                            return new graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#0CF49B'},
                                                    {offset: 1, color: '#0CF49B33'}
                                                ]
                                            );
                                        } else {
                                            console.log( 'Here' );
                                            return new graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#FF1050'},
                                                    {offset: 1, color: '#FF105033'}
                                                ]
                                            );
                                        }
                                    },
                                    // color: new graphic.LinearGradient(
                                    //     0, 0, 0, 1,
                                    //     [
                                    //         {offset: 0, color: '#0CF49B'},
                                    //         {offset: 1, color: '#0CF49B33'}
                                    //     ]
                                    // ),
                                    borderColor: '#0CF49B99',
                                    borderWidth: 1
                                },
                                data: markers
                            },
                        },
                        {
                            name: 'SMA 12',
                            data: sma12,
                            type: 'line',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#00aaff',
                                },
                            },
                        },
                        {
                            name: 'SMA 26',
                            data: sma26,
                            type: 'line',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#ff0099',
                                },

                            }
                        },
                        {
                            name: 'Volume',
                            data: volumes,
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            itemStyle: {
                                normal: {
                                    color: ( params ) => {
                                        if ( params.dataIndex > 1 ) {
                                            if ( ohlc[params.dataIndex][3] > ohlc[params.dataIndex - 1][3]) {
                                                // If close( n ) < close( n - 1 )
                                                if ( ohlc[params.dataIndex][1] <= ohlc[params.dataIndex][0] ) {
                                                    return new graphic.LinearGradient(
                                                        0, 0, 0, 1,
                                                        [
                                                            {offset: 0, color: '#FF105033'},
                                                            {offset: 1, color: '#FF1050'}
                                                        ]
                                                    )
                                                } else {
                                                    return new graphic.LinearGradient(
                                                        0, 0, 0, 1,
                                                        [
                                                            {offset: 0, color: '#0CF49B'},
                                                            {offset: 1, color: '#0CF49B33'}
                                                        ]
                                                    )
                                                }
                                            } else {
                                                return '#111';
                                            }
                                        } else {
                                            return '#0CFF9B';
                                        }
                                    },
                                    borderColor: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#0CF49B'},
                                            {offset: 1, color: '#0CF49B33'}
                                        ]
                                    ),
                                    borderColor0: new graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#FF105033'},
                                            {offset: 1, color: '#FF1050'}
                                        ]
                                    ),
                                    barBorderWidth: 1
                                },
                            }
                        },
                        {
                            name: 'RSI',
                            data: rsi,
                            type: 'line',
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    color: '#00ff99',
                                    width: 1,
                                },

                            }
                        },
                        {
                            data: rsiTop,
                            type: 'line',
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#ff0099',
                                    opacity: 0.5
                                },

                            }
                        },
                        {
                            data: rsiLow,
                            type: 'line',
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#ff0099',
                                    opacity: 0.5
                                },

                            }
                        },
                        {
                            data: rsiMiddle,
                            type: 'line',
                            xAxisIndex: 2,
                            yAxisIndex: 2,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#fff',
                                    opacity: 0.3
                                },

                            }
                        },
                        {
                            name: 'MACD Short',
                            data: macd.short,
                            type: 'line',
                            xAxisIndex: 3,
                            yAxisIndex: 3,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#0CFF9B',
                                },

                            }
                        },
                        {
                            name: 'MACD Long',
                            data: macd.long,
                            type: 'bar',
                            xAxisIndex: 3,
                            yAxisIndex: 3,
                            symbol: 'circle',
                            symbolSize: 0,
                            itemStyle: {
                                normal: {
                                    barBorderWidth: 0.5,
                                    barBorderColor: '#777',
                                    color: ( params ) => {
                                        if ( macd.long[params.dataIndex] < 0 ) {
                                            return new graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#FF105033'},
                                                    {offset: 1, color: '#FF1050'}
                                                ]
                                            )
                                        } else {
                                            return new graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#0CF49B'},
                                                    {offset: 1, color: '#0CF49B33'}
                                                ]
                                            )
                                        }
                                    }
                                },
                            },
                        },
                        {
                            name: 'MACD Signal',
                            data: macd.signal,
                            type: 'line',
                            xAxisIndex: 3,
                            yAxisIndex: 3,
                            symbol: 'circle',
                            symbolSize: 0,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#FF1050',
                                },

                            }
                        },
                    ]
                };
            }, // Called whenever there is a message from the server.
            err => console.log( err ), // Called if at any point WebSocket API signals some kind of error.
            () => console.log( 'complete' ) // Called when connection is closed (for whatever reason).
        );
    }

    private _symbolSelected( event ) {
        this._portfolioService.resetPortfolio();
        this._symbolsService.setCurrentSymbol( event );
    }

    private _strategySelected( event ) {
        this._portfolioService.resetPortfolio();
        this._strategiesService.setCurrentStrategy( event );
        this.subject.next({
            command: 'GET_QUOTE',
            options: {
                quote: this._currentStockSymbol.symbol
            }
        });
    }
}
