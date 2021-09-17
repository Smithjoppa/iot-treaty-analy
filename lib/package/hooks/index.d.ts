import SerialPortBean from "./serial";
declare class BaseGet {
    static instance: any;
    static requestType: RequestType;
    constructor(requestType: RequestType);
    connect(...args: any[]): any;
    /**
     * 关闭串口/socket客户端
     * @param id 模块编码
     */
    close(id?: number): Promise<any>;
    /**
     * 写入报文
     * @param msg 报文
     */
    write(msg: Array<number>): Promise<any>;
    /**
     * 修改串口波特率 串口方法
     * @param op 波特率
     */
    update?(op: SerialPortBean.UpdateOptions | any): any;
    /**
     * 单例模式方法
     */
    static getInstance(requestType: RequestType): any;
}
declare type RequestType = 'SerialPort' | 'Socket';
export { BaseGet, RequestType };
