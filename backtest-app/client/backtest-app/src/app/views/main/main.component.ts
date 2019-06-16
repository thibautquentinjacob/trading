import { Component } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import { EChartOption, graphic } from 'echarts';
import { ActivatedRoute, Params } from '@angular/router';

import { PortfolioService } from '../../services/portfolio.service';
import { Strategy } from '../../models/Strategy';
import { StrategicDecision } from '../../models/StragegicDecision';
import { Stock } from '../../models/Stock';
import { Marker } from '../../models/Marker';
import { Symbol } from '../../models/Symbol';
import { ServerCommand } from 'src/app/models/ServerCommand';

// Services
import { SymbolsService } from '../../services/symbols.service';
import { StrategiesService } from 'src/app/services/strategies.service';

// Chart descriptions
import { SMA } from 'src/app/models/chart-descriptions/SMA';
import { RSI } from 'src/app/models/chart-descriptions/RSI';
import { MACD } from 'src/app/models/chart-descriptions/MACD';
import { environment } from 'src/environments/environment';
import { Indicator } from 'src/app/models/Indicator';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    title                             = 'backtest-app';
    socket:      WebSocketSubject<{}> = webSocket(`ws://${environment.SERVER_HOSTNAME}:${environment.SERVER_PORT}`);
    chartOption: EChartOption         = {};

    private _cash:                number;
    private _stocks:              {[key: string]: Stock };
    public  _currentStockSymbol:  Symbol;
    public  _symbols:             Symbol[];
    public  _currentStrategyName: string;
    public  _currentStrategy:     Strategy;
    public  _strategies:          string[];

    constructor (
        private _portfolioService:  PortfolioService,
        private _symbolsService:    SymbolsService,
        private _strategiesService: StrategiesService,
        private _activatedRoute:    ActivatedRoute
    ) {

        // Check activated route params. If a symbol has been passed,
        // use as current symbol. Otherwise, use default defined in
        // environment file.
        this._activatedRoute.params.subscribe(( params: Params ) => {
            // If symbol was passed
            if ( params.symbol ) {
                console.log( `Setting symbol to ${params.symbol}` );
                this._symbolsService.setCurrentSymbol({
                    name: '',
                    symbol: params.symbol
                });
            // Otherwise use default
            } else {
                console.log( `No symbol passed, setting symbol to ${environment.DEFAULT_SYMBOL}` );
                this._symbolsService.setCurrentSymbol({
                    name:   '',
                    symbol: environment.DEFAULT_SYMBOL
                });
            }
        });

        // On strategy name change, update local variable
        this._strategiesService.currentStrategyName.subscribe(( strategyName: string ) => {
            this._currentStrategyName = strategyName;
        });

        // On strategy change, update local variable
        this._strategiesService.currentStrategy.subscribe(( strategy: Strategy ) => {
            this._currentStrategy = strategy;
        });

        // On strategy list update, update local variable
        this._strategiesService.strategies.subscribe(( strategies: string[] ) => {
            this._strategies = strategies;
        });

        // On symbol list update, update local variable
        this._symbolsService.symbols.subscribe(( symbols: Symbol[] ) => {
            this._symbols = symbols;
        });

        // On current symbol change, send 'GET_QUOTE' command to server
        this._symbolsService.currentSymbol.subscribe(( symbol: Symbol ) => {
            console.log( `Got update ${symbol.symbol}` );
            this._currentStockSymbol = symbol;
            this.socket.next({
                command: ServerCommand.GET_QUOTE,
                options: {
                    quote:    this._currentStockSymbol.symbol,
                    strategy: this._currentStrategy
                }
            });
        });

        this._portfolioService.cash.subscribe(( cash: number ) => {
            this._cash = cash;
            console.log( `Cash remaining: ${this._cash}` );
        });

        this._portfolioService.stocks.subscribe(( stocks: {[key: string]: Stock }) => {
            this._stocks = stocks;
        });

        // On server message
        this.socket.subscribe(
            ( msg: any ) => {
                console.log( 'message received', msg );
                // Initialize data structure to hold OHLC, time and TI data
                const data: {[key: string]: {[key: string]: number[]} | Date } = {};

                // For each indicators in the current strategy
                // create a new entry in the structure.
                const indicatorKeys: string[] = Object.keys( this._currentStrategy.indicators );
                for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
                    const indicatorName: string    = indicatorKeys[i];
                    const indicator:     Indicator = this._currentStrategy.indicators[indicatorName];
                    data[indicatorName]         = {};
                    // For each technical indicator output
                    for ( let j = 0, outputSize = indicator.output.length ; j < outputSize ; j++ ) {
                        data[indicatorName][indicator.output[j]] = [];
                    }
                }
                console.log( data );

                const date:      string[]   = [];
                const ohlc:      number[][] = [];
                const volumes:   number[]   = [];

                const sma12:     number[]   = [];
                const sma26:     number[]   = [];
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

                msg._quotes.forEach( element => {

                    const transformedDate       = this._convertDate( element.date );
                    date.push( transformedDate );
                    sma12.push( element.sma_12_0 );
                    sma26.push( element.sma_26_0 );
                    ohlc.push([
                        element.open,
                        element.high,
                        element.low,
                        element.close
                    ]);
                    volumes.push( element.volume );

                    // Compute technical indicators required by the current strategy
                    rsi.push( element.rsi_7_0 );
                    rsiTop.push( 70 );
                    rsiLow.push( 30 );
                    rsiMiddle.push( 50 );

                    macd.short.push( element.macd_1_8_6_0 );
                    macd.long.push( element.macd_1_8_6_1 );
                    macd.signal.push( element.macd_1_8_6_2 );

                    // Try strategies
                    const data: {[key: string]: number | Date } = {
                        rsi:   element.rsi_7_0,
                        sma12: element.sma_12_0,
                        sma26: element.sma_26_0,
                        macd:  element.macd_1_8_6_1,
                        time:  new Date( element.date )
                    };

                    const buyDecision:  StrategicDecision = this._currentStrategy.shouldBuy( data );
                    const sellDecision: StrategicDecision = this._currentStrategy.shouldSell( data );


                    if ( buyDecision.decision && ( buyDecision.amount > 0 || buyDecision.amount === -1 )) {
                        const amount: number = Math.floor(( this._cash - 25000 ) / element.open );
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
                        const amount: number =
                            this._stocks[this._currentStockSymbol.symbol] ? this._stocks[this._currentStockSymbol.symbol].amount : 0;
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
                const chartDescriptions: {[key: string]: EChartOption.SeriesLine[]} = {
                    sma26: new SMA( ['SMA 26'], [sma26], ['#ff0099'] ).generateDescription(),
                    sma12: new SMA( ['SMA 16'], [sma12], ['#00aaff'] ).generateDescription()
                };
                this.chartOption = {
                    grid: [
                        // Candlesticks
                        {
                            show: false,
                            backgroundColor: '#f00',
                            left: '5%',
                            right: '5%',
                            height: '40%'
                        },
                        // Volume
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
                        chartDescriptions.sma12[0],
                        chartDescriptions.sma26[0],
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
                    ]
                };
                this.chartOption.series = this.chartOption.series.concat( new RSI(
                    ['RSI', null, null, null],
                    [rsi, rsiTop, rsiLow, rsiMiddle],
                    ['#00ff99', '#ff0099', '#ff0099', '#fff']
                ).generateDescription());
                this.chartOption.series = this.chartOption.series.concat( new MACD(
                    ['MACD Short', 'MACD Long', 'MACD Signal'],
                    [macd.short, macd.long, macd.signal],
                    ['#0CFF9B', '#FF105033', '#FF1050', '#0CF49B', '#0CF49B33', '#FF1050']
                ).generateDescription());
            }, // Called whenever there is a message from the server.
            err => console.log( err ), // Called if at any point WebSocket API signals some kind of error.
            () => console.log( 'complete' ) // Called when connection is closed (for whatever reason).
        );
    }

    /**
     * Symbol selection handler
     *
     * @param event
     */
    private _symbolSelected ( event ) {
        this._portfolioService.resetPortfolio();
        this._symbolsService.setCurrentSymbol( event );
    }

    /**
     * Format date to be displayed in the plot.
     *
     * @private
     * @param {string} date - Input date as a string
     * @returns {string} Formatted date
     */
    private _convertDate ( date: string ): string {
        const parsedDate:    Date   = new Date( date );
        const parsedHours:   string = parsedDate.getHours() > 9 ?
                                      parsedDate.getHours() + '' :
                                      '0' + parsedDate.getHours();
        const parsedMinutes: string = parsedDate.getMinutes() > 9 ?
                                      parsedDate.getMinutes() + '' :
                                      '0' + parsedDate.getMinutes();
        return `${parsedHours}:${parsedMinutes}`;
    }

    private _strategySelected( event ) {
        this._portfolioService.resetPortfolio();
        this._strategiesService.setCurrentStrategy( event );
        this.socket.next({
            command: ServerCommand.GET_QUOTE,
            options: {
                quote: this._currentStockSymbol.symbol
            }
        });
        // Load strategies
        // this.chartOption.series = this.chartOption.series.concat( new RSI(
        //     ['RSI', null, null, null],
        //     [rsi, rsiTop, rsiLow, rsiMiddle],
        //     ['#00ff99', '#ff0099', '#ff0099', '#fff']
        // ).generateDescription());
        // this.chartOption.series = this.chartOption.series.concat( new MACD(
        //     ['MACD Short', 'MACD Long', 'MACD Signal'],
        //     [macd.short, macd.long, macd.signal],
        //     ['#0CFF9B', '#FF105033', '#FF1050', '#0CF49B', '#0CF49B33', '#FF1050']
        // ).generateDescription());
    }
}
