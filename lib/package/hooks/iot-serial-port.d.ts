/// <reference types="node" />
import { RequestType } from '.';
import SerialPortBean from "../../types/serial";
import ModbusParser from "../parse-crc/modbus-parser";
export default class IotSerialPort {
    requestType?: RequestType | any;
    option?: SerialPortBean.OpenOptions;
    serialport?: any | undefined;
    static instance?: IotSerialPort;
    parse: ModbusParser | undefined;
    constructor();
    connect(path: string, options?: SerialPortBean.OpenOptions): Promise<any>;
    close(): Promise<any>;
    write(msg?: Array<number>): Promise<Buffer>;
    update?(op: SerialPortBean.UpdateOptions): void;
    /**
     * 分割数据头
     * @param moduleNum 模块编号
     */
    resetModuleNum(moduleNum: Array<number>): void;
    listPort(): any;
    private throwErrorSerialport;
    static getInstance(requestType: RequestType): IotSerialPort;
}
