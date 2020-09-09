import { App } from './app';
import { Constants } from './constants';
import { GetQuoteHandler } from './message-handlers/get-quote-handler';
import { GetSymbolsHandler } from './message-handlers/get-symbols-handler';

new App({
    port: Constants.WEBSERVER_PORT,
    messageHandlers: {
        GET_QUOTE: new GetQuoteHandler(),
        GET_SYMBOLS: new GetSymbolsHandler(),
    },
});
