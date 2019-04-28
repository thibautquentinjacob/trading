/*
 * File: Helper.ts
 * Project: server
 * File Created: Monday, 1st April 2019 12:39:47 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Monday, 1st April 2019 11:34:49 pm
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



import { OperationState } from "./models/OperationState";
import { white, grey, magenta, yellow, blue, red, green } from "colors";
import { ErrorMessage } from "./models/ErrorMessage";

export class Helper {

    public static formatLog(
        route:         string,
        message:       string,
        uuid:          string,
        state:         OperationState,
        errorMessage?: ErrorMessage
    ): string {

        if ( state === OperationState.PENDING ) {
            return white( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${blue( state )}` );
        } else if ( state === OperationState.FAILURE && errorMessage ) {
            return red( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${red( state )}: ${errorMessage.name} [${errorMessage.statusCode}]` );
        } else if ( state === OperationState.SUCCESS ) {
            return green( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${green( state )}` );
        } else {
            return grey( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${blue( state )}` );
        }
    }

}
