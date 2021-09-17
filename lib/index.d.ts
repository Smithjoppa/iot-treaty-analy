/// <reference types="node" />
import IotSerialPort from './package/hooks/iot-serial-port';
import IotSocket from './package/hooks/iot-socket';
import SerialPortBean from './types/serial';
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
declare const _default: {
    IotConnect: typeof IotConnect;
};
export default _default;
