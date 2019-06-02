/*
 * File: constants.ts
 * Project: server
 * File Created: Tuesday, 26th March 2019 12:34:55 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 23rd May 2019 1:00:32 am
 * Modified By: Licoffe (p1lgr11m@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2019 Licoffe
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



export class Constants {

    // IEX Cloud API settings
    public static IEX_CLOUD_DATA_URL:         string = 'https://cloud-sse.iexapis.com/';
    public static IEX_CLOUD_VERSION:          string = 'stable';
    public static IEX_CLOUD_STREAM_PRECISION: string = 'stocksUS1Minute';
    public static IEX_CLOUD_PRIVATE_TOKEN:    string = 'sk_17df8f49db65407eb7aba757e1faeeae';

    // Alpaca API settings
    public static ALPACA_API_URL:             string = 'https://paper-api.alpaca.markets';
    public static ALPACA_KEY_ID:              string = 'PKZHLVTKOXLFX097CS6B';
    public static ALPACA_KEY_SECRET:          string = 'VNMwCnCytEk/51EjDgeiJgFjz2hIuDOZ/z0rV/8B';

    public static IEXCloudAPIDefaultHeaders: any = {
        'Accept': 'text/event-stream'
    };

    public static alpacaDefaultHeaders: any = {
        'APCA-API-KEY-ID':     Constants.ALPACA_KEY_ID,
        'APCA-API-SECRET-KEY': Constants.ALPACA_KEY_SECRET
    };


}
