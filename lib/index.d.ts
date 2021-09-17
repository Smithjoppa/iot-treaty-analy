/// <reference types="node" />
import IotSerialPort from './package/hooks/iot-serial-port';
import IotSocket from './package/hooks/iot-socket';
import SerialPortBean from './package/hooks/serial';
declare class IotConnect {
    private type;
    private path;
    private options;
    private host;
    private port;
    private channel;
    private msgQueue;
    constructor(type: IotSerialPort | IotSocket);
    configSerial(path: string, options: SerialPortBean.OpenOptions): void;
    configSocket(host: string, port: number): void;
    write(msg: Array<number>): Promise<Buffer>;
    close(): void;
    initStartChannel(): void;
}
export default IotConnect;
