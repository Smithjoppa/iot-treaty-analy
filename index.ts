import _ from 'lodash';
import CrcUtil from './utils';
import IotSerialPort from './package/hooks/iot-serial-port';
import IotSocket from './package/hooks/iot-socket';

class IotConnect {
  private type: IotSerialPort | IotSocket

  private path!: string;
  private options!: SerialPortBean.OpenOptions;

  private host!: string
  private port!: number

  private channel!: IotSerialPort | IotSocket

  private msgQueue!: MsgQueue

  constructor(type: IotSerialPort | IotSocket) {
    this.type = type
  }
  configSerial(path: string, options: SerialPortBean.OpenOptions): void {
    this.path = path
    this.options = options
  }
  configSocket(host: string, port: number) {
    this.host = host
    this.port = port
  }
  write(msg: Array<number>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.msgQueue.write(msg, (buf: Buffer) => {
        resolve(buf)
      })
    });
  }
  close() {
    try {
      this.channel.close()
    } catch (error) {
      throw new Error(error + "")
    }
  }
  initStartChannel() {
    if (this.type instanceof IotSerialPort) {
      this.channel = initSerialPort(this.path, this.options)
      if (_.isEmpty(this.channel.parse)) {
        throw new Error("this serial parse is undefined")
      }
      // Set the serial port channel to be sent
      this.msgQueue = MsgQueue.getInstance(this.channel.parse, this.channel)
    }
    if (this.type instanceof IotSocket) {
      this.channel = initSocket(this.host, this.port)
      //Set the net channel to be sent
      this.msgQueue = MsgQueue.getInstance(this.channel.server, this.channel)
    }
  }
}
class MsgQueue {
  private _listenObj: any
  private _queue!: Array<any>
  private _channel: IotSerialPort | IotSocket
  private _busy = false
  private _current!: Array<any>
  private static _instance: MsgQueue
  private static util = new CrcUtil()

  constructor(listenObj: any, channel: IotSerialPort | IotSocket) {
    this._listenObj = listenObj
    this._channel = channel
    this.setListenObj(listenObj)
  }


  static getInstance(serial: any, channel: IotSerialPort | IotSocket) {
    if (!this._instance) {
      this._instance = new MsgQueue(serial, channel)
    }
    return this._instance
  }
  write(data: Array<number>, callback: Function) {
    this._queue.unshift([data, callback])
    if (this._busy) return
    this._busy = true
    this.processQueue()
  }
  setListenObj(listenObj: any) {
    this._listenObj = listenObj
    if (this._channel instanceof IotSerialPort) {
      this._listenObj.on('data', (data: Buffer) => {
        if (!this._current) return
        // get buffer and return to callback
        this._current[1](data)
        this.processQueue()
      })
    } else {
      this._listenObj.on('connection', (socket: { on: (arg0: string, arg1: (data: any) => void) => void; }) => {
        // data 事件就是读取数据
        socket.on('data', (data) => {
          const msg = data
          const channelId = MsgQueue.util.byteArray2Int([msg[0], msg[1]])
          if (MsgQueue.util.byteArray2Int([msg[2], msg[3]]) && data.length === 4) {
            console.log('device Code', channelId)
            return
          }
          if (!this._current) return
          //get buffer and return to callback
          this._current[1](data)
          this.processQueue()
        })
      })
    }
  }
  processQueue() {
    var next = this._queue.shift()
    if (!next) {
      this._busy = false
      return
    }
    this._current = next
    console.log(next[0])
    this._channel.write(next[0])
  }
}
function initSerialPort(path: string, options: SerialPortBean.OpenOptions): IotSerialPort {
  if (_.isEmpty(path)) {
    throw new Error("serial port path is undefined")
  }
  if (_.isEmpty(options)) {
    throw new Error("options is undefined")
  }
  let SerialPort = IotSerialPort.getInstance("SerialPort")
  SerialPort.connect(path, options)
  return SerialPort
}
function initSocket(host: string, prot: number): IotSocket {
  if (_.isEmpty(host)) {
    throw new Error("host is undefined")
  }
  if (_.isEmpty(prot)) {
    throw new Error("port is undefined")
  }
  let socket = IotSocket.getInstance("Socket")
  return socket
}
export default { IotConnect }