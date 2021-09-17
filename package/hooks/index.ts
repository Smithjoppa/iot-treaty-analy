import SerialPortBean from "./serial"


declare class BaseGet {

  static instance: any
  static requestType: RequestType //请求方式

  constructor(requestType: RequestType)   //构造函数

  connect(...args: any[]): any
  /**
   * 关闭串口/socket客户端
   * @param id 模块编码
   */
  close(id?: number): Promise<any>

  /**
   * 写入报文
   * @param msg 报文
   */
  write(msg: Array<number>): Promise<any>

  /**
   * 修改串口波特率 串口方法
   * @param op 波特率
   */
  update?(op: SerialPortBean.UpdateOptions | any): any

  /**
   * 单例模式方法
   */
  public static getInstance(requestType: RequestType): any

}

type RequestType = | 'SerialPort' | 'Socket'


export { BaseGet, RequestType }