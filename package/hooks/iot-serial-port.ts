import _ from "lodash";
import { BaseGet, RequestType } from '.';
import SerialPortBean from "../../types/serial";
import ModbusParser from "../parse-crc/modbus-parser";
const SerialPort = require('serialport')

export default class IotSerialPort {
  requestType?: RequestType | any;
  option?: SerialPortBean.OpenOptions
  serialport?: any | undefined
  static instance?: IotSerialPort;
  parse: ModbusParser | undefined;
  constructor() {
    // super(requestType)
    let requestType = "SerialPort"
    this.requestType = requestType
  }
  connect(path: string, options?: SerialPortBean.OpenOptions): Promise<any> {
    if (_.isEmpty(path)) {
      throw new Error("COM is Null.");
    }
    this.option = options
    this.serialport = new SerialPort(path, options)
    return new Promise((resolve, reject) => {
      this.serialport?.on('open', (msg: any | ArrayBuffer) => {
        resolve(msg)
      })
      this.serialport?.on('error', (err: any) => {
        reject(err)
      })
    });
  }
  close(): Promise<any> {
    this.throwErrorSerialport()
    return new Promise((resolve, _reject) => {
      this.serialport.close((res: any) => {
        resolve(res)
      })
    });
  }
  write(msg?: Array<number>): Promise<Buffer> {
    this.throwErrorSerialport()
    this.serialport.flush()
    return new Promise((resolve, reject) => {
      this.serialport?.write(msg, (_res: any) => {
        this.parse?.on("data", (message: Buffer) => {
          resolve(message)
        })
      })
    });
  }
  update?(op: SerialPortBean.UpdateOptions) {
    this.serialport.update(op)
    throw new Error("Method not implemented.");
  }
  /**
   * 分割数据头
   * @param moduleNum 模块编号
   */
  resetModuleNum(moduleNum: Array<number>) {
    if (_.isEmpty(this.serialport)) {
      throw new Error("serialport is undefined.");
    }
    this.parse = new ModbusParser({ moduleNum: moduleNum, needMBHeader: true })
    this.serialport.pipe(this.parse)
  }
  listPort() {
    this.throwErrorSerialport()
    return this.serialport.list()
  }
  private throwErrorSerialport() {
    if (_.isEmpty(this.serialport)) {
      throw new Error("serialport is null")
    }
  }
  public static getInstance(requestType: RequestType): IotSerialPort {
    if (!IotSerialPort.instance) {
      IotSerialPort.instance = new IotSerialPort();
    }
    return IotSerialPort.instance;
  }
}