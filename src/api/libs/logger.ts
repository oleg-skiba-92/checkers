//#region types
declare var process;

export type TLogLevel =
  | 'OFF'
  | 'INFO'
  | 'DEBUG'
  ;

export type TLogColor =
  | 'white'
  | 'yellow'
  | 'red'
  | 'green'
  | 'gray'
  | 'blue'
  | 'cyan'
  ;

export interface ICustomLog {
  message: string;
  data?: object | number | string;
  color: TLogColor;
}

export interface ILogger {
  info(message: string, data?: any): void;

  warn(message: string, data?: any): void;

  error(message: string, data?: any): void;

  success(message: string, data?: any): void;

  custom(message: ICustomLog[]): void;
}

//#endregion types

export class Logger implements ILogger {
  private module: string;

  //#region private getters
  private get logLevel(): TLogLevel {
    return process.env.LOG_LEVEL || 'INFO';
  }

  private get showDate(): boolean {
    let value = this.convertStringToBoolean(process.env.LOG_SHOW_DATE);
    return value !== null ? value : false;
    return process.env.LOG_SHOW_DATE || false;
  }

  private get showTime(): boolean {
    let value = this.convertStringToBoolean(process.env.LOG_SHOW_TIME);
    return value !== null ? value : true;
  }

  private get showModule(): boolean {
    let value = this.convertStringToBoolean(process.env.LOG_SHOW_MODULE);
    return value !== null ? value : true;
  }

  private get showColor(): boolean {
    let value = this.convertStringToBoolean(process.env.LOG_SHOW_COLOR);
    return value !== null ? value : true;
  }

  private get delimiter(): string {
    return process.env.LOG_DELIMITER || ' | ';
  }

  private get date(): string {
    // tslint:disable:no-magic-numbers
    let _now = new Date();
    let _str = '';
    let _timeStr = [
      _now.getHours().toString().padStart(2, '0'),
      _now.getMinutes().toString().padStart(2, '0'),
      _now.getSeconds().toString().padStart(2, '0'),
      _now.getMilliseconds().toString().padStart(3, '0'),
    ].join(':');
    let _dateStr = [
      _now.getDate().toString().padStart(2, '0'),
      (_now.getMonth() + 1).toString().padStart(2, '0'),
      _now.getFullYear().toString().padStart(4, '0'),
    ].join('/');
    // tslint:enable:no-magic-numbers

    return `${this.showTime ? _timeStr : ''} ${this.showDate ? _dateStr : ''}`.trim();
  }

  //#endregion private getters

  constructor(module: string = 'default') {
    this.module = module;
  }

  //#region public methods
  public info(message: string, data: any = null) {
    this.log(this.color(message, 'white'), data);
  }

  public warn(message: string, data: any = null) {
    this.log(this.color(message, 'yellow'), data);
  }

  public error(message: string, data: any = null) {
    this.log(this.color(message, 'red'), data);
  }

  public success(message: string, data: any = null) {
    this.log(this.color(message, 'green'), data);
  }

  public custom(message: ICustomLog[]): void {
    let _arr = message.reduce((acc, curr) => {
      acc.push(this.color(curr.message + (!!curr.data ? (' ' + JSON.stringify(curr.data)) : ''), curr.color));

      return acc;
    }, []);

    console.log(_arr.join(this.delimiter));
  }

  //#endregion public methods

  //#region private methods
  private log(message: string, data: any): void {
    if (this.logLevel === 'OFF') {
      return;
    }

    let _arr = [];

    if (this.showDate || this.showTime) {
      _arr.push(this.color(`[${this.date}]`, 'gray'));
    }

    if (this.showModule) {
      _arr.push(this.color(`(${this.module})`, 'cyan'));
    }

    _arr.push(message);

    if (data && this.logLevel === 'DEBUG') {
      _arr.push(this.color(JSON.stringify(data), 'blue'));
    }

    // tslint:disable-next-line:no-console
    console.log(_arr.join(this.delimiter));
  }

  private color(message: string, color: TLogColor): string {
    if (!this.showColor) {
      return message;
    }

    switch (color) {
      case 'white':
        return `\x1b[37m${message}\x1b[39m`;
      case 'yellow':
        return `\x1b[33m${message}\x1b[39m`;
      case 'red':
        return `\x1b[31m${message}\x1b[39m`;
      case 'green':
        return `\x1b[32m${message}\x1b[39m`;
      case 'gray':
        return `\x1b[90m${message}\x1b[39m`;
      case 'blue':
        return `\x1b[34m${message}\x1b[39m`;
      case 'cyan':
        return `\x1b[36m${message}\x1b[39m`;
    }
  }

  private convertStringToBoolean(value: string): boolean {
    if (value === undefined) {
      return null;
    }

    switch (value.toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return null;
    }
  }

  //#endregion private methods
}
