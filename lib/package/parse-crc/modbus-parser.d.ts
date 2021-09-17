/// <reference types="node" />
import CrcUtil from "../../utils/index";
import { Transform } from "stream";
/**
 * options : needMBHeader 是否显示modbus协议头，默认true
 */
export default class ModbusParser extends Transform {
    crcUtil: CrcUtil;
    listenLoopSize: number;
    needMBHeader: boolean;
    buffer: Buffer | any;
    delimiters: Array<number>;
    constructor(options: any);
    resetModuleNum(moduleNum: Array<number>): void;
    _transform(chunk: Buffer, _encoding: any, cb: () => void): void;
    checkIsModbusStart(chunk: Buffer): boolean;
    _flush(cb: () => void): void;
}
