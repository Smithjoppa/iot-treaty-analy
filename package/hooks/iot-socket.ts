import _ from 'lodash';
import net, { Server } from 'net'
import { BaseGet, RequestType } from '../../types';
export default class IotSocket extends BaseGet {
  requestType: RequestType;
  server: net.Server | undefined | null;
  private PORT!: number;
  private HOST!: string
  private clientSocks: any
  constructor(requestType: RequestType) {
    super(requestType)
    this.requestType = requestType
  }
  setConfigNet(HOST: string, PORT: number) {
    this.HOST = HOST
    this.PORT = PORT
  }
  connect(start: Function): void {
    this.server = net.createServer(function (clientSocket) {
      console.log(`连接客户端Ip: ${clientSocket.remoteAddress}:${clientSocket.remotePort}`);
      clientSocket.on('end', function () {
        console.log(`客户端断开连接:${clientSocket?.remoteAddress}:${clientSocket?.remotePort}`);
      })
    })
    this.server?.listen(this.PORT, this.HOST);
    this.server.on("listening", () => {
      console.log(`开启服务${this.PORT}`);
    })
    this.server.on("error", (err) => {
      console.log(`error:${err}`);
      throw new Error(`error:${err}`)
    })
    this.server.on("connection", socket => {
      socket.on('data', (msg: Array<number>) => {
        const channelId = this.byteArray2Int([msg[0], msg[1]])
        if (this.byteArray2Int([msg[2], msg[3]]) && msg.length === 4) {
          this.clientSocks['client-' + channelId] = socket
          if (!_.isEmpty(start)) {
            start()
          }
        }
      })
    })
  }
  close(): Promise<any> {
    return new Promise((resolve, _reject) => {
      for (const key in this.clientSocks) {
        this.clientSocks[key].destroy()
      }
      this.server?.close()
      this.server = null
      resolve("success")
    });
  }
  write(msg: Array<number>): Promise<Buffer> {
    const client = this.clientSocks['client-' + msg[0]]
    if (!_.isEmpty(client))
      return new Promise((resolve, reject) => {
        client.write(msg)
        this.server?.on("connection", socket => {
          socket.on('data', (msg: Buffer) => {
            if (this.byteArray2Int([msg[2], msg[3]]) && msg.length === 4) {
              reject()
            } else {
              resolve(msg)
            }
          })
        })
      });
    throw new Error("no response.");
  }
  byteArray2Int(b: Array<number>) {
    let value = 0
    for (let i = b.length - 1; i >= 0; i--) {
      const shift = (b.length - 1 - i) * 8
      value += (b[i] & 0x000000ff) << shift
    }
    return value
  }
  public static getInstance(requestType: RequestType): IotSocket {
    if (!IotSocket.instance) {
      IotSocket.instance = new IotSocket(requestType);
    }
    return IotSocket.instance;
  }
}