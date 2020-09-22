import { App } from './app';
import { Constants } from './constants';

new App({
    dbHost: Constants.DB_HOST as string,
    dbPort: Constants.DB_PORT as number,
});
