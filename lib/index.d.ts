/// <reference types="node" />
import SerialPortBean from './package/hooks/serial';
declare enum typeModel {
    IotSerialPort = 0,
    IotSocket = 1
}
declare class IotConnect {
    private type;
    private path;
    private options;
    private host;
    private port;
    private channel;
    private msgQueue;
    constructor(type: typeModel);
    configSerial(path: string, options: SerialPortBean.OpenOptions): void;
    configSocket(host: string, port: number): void;
    write(msg: Array<number>): Promise<Buffer>;
    close(): void;
    initStartChannel(): void;
}
export default IotConnect;
