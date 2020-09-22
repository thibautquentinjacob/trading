import { blue, green, grey, magenta, red, white, yellow } from 'colors';
import { EOperationState } from './models/EOperationState';
import { ErrorMessage } from './models/IErrorMessage';

export class Helper {
    public static pending(route: string, message: string, uuid: string): void {
        console.log(
            white(
                `${grey('>>>')} ${magenta.bold(
                    route
                )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${blue(
                    EOperationState.PENDING
                )}`
            )
        );
    }

    public static success(route: string, message: string, uuid: string): void {
        console.log(
            green(
                `${grey('>>>')} ${magenta.bold(
                    route
                )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${green(
                    EOperationState.SUCCESS
                )}`
            )
        );
    }

    public static failure(
        route: string,
        message: string,
        uuid: string,
        errorMessage: ErrorMessage
    ): void {
        console.error(
            red(
                `${grey('>>>')} ${magenta.bold(
                    route
                )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${red(
                    EOperationState.FAILURE
                )}: ${errorMessage.name} [${errorMessage.statusCode}]`
            )
        );
    }
}
