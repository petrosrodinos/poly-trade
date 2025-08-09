import chalk from 'chalk';

type LogArgs = [msg: string, ...args: unknown[]];

export const logger = {
    info: (...args: LogArgs): void => {
        console.log(chalk.blue('[INFO]'), ...args);
    },
    warn: (...args: LogArgs): void => {
        console.warn(chalk.yellow('[WARN]'), ...args);
    },
    error: (...args: LogArgs): void => {
        console.error(chalk.red('[ERROR]'), ...args);
    },
    success: (...args: LogArgs): void => {
        console.log(chalk.green('[SUCCESS]'), ...args);
    },
    debug: (...args: LogArgs): void => {
        console.log(chalk.bgMagenta('[DEBUG]'), ...args);
    },
    log: (...args: LogArgs): void => {
        console.log(chalk.bgBlue('[LOG]'), ...args);
    },
    long: (...args: LogArgs): void => {
        console.log(chalk.bgGreen('[LONG]'), ...args);
    },
    short: (...args: LogArgs): void => {
        console.log(chalk.bgRed('[SHORT]'), ...args);
    },
};

