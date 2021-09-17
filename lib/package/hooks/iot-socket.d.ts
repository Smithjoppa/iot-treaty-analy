/// <reference types="node" />
import net from 'net';
import { BaseGet, RequestType } from '../../types';
export default class IotSocket extends BaseGet {
    requestType: RequestType;
    server: net.Server | undefined | null;
    private PORT;
    private HOST;
    private clientSocks;
    constructor(requestType: RequestType);
    setConfigNet(HOST: string, PORT: number): void;
    connect(start: Function): void;
    close(): Promise<any>;
    write(msg: Array<number>): Promise<Buffer>;
    byteArray2Int(b: Array<number>): number;
    static getInstance(requestType: RequestType): IotSocket;
}
