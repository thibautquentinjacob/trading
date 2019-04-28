/*
 * File: AccountStatus.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:47:04 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 28th March 2019 1:04:04 am
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



export enum AccountStatus {

    ONBOARDING        = 'ONBOARDING',
    SUBMISSION_FAILED = 'SUBMISSION_FAILED',
    SUBMITTED         = 'SUBMITTED',
    ACCOUNT_UPDATED   = 'ACCOUNT_UPDATED',
    APPROVAL_PENDING  = 'APPROVAL_PENDING',
    ACTIVE            = 'ACTIVE',
    REJECTED          = 'REJECTED'

}
