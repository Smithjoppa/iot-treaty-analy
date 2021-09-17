declare namespace SerialPortBean {
  // Callbacks Type Defs
  type ErrorCallback = (error?: Error | null) => void;
  type ModemBitsCallback = (error: Error | null | undefined, status: { cts: boolean, dsr: boolean, dcd: boolean }) => void;

  // Options Type Defs
  interface OpenOptions {
    autoOpen?: boolean | undefined;
    baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number | undefined;
    dataBits?: 8 | 7 | 6 | 5 | undefined;
    highWaterMark?: number | undefined;
    lock?: boolean | undefined;
    stopBits?: 1 | 2 | undefined;
    parity?: 'none' | 'even' | 'mark' | 'odd' | 'space' | undefined;
    rtscts?: boolean | undefined;
    xon?: boolean | undefined;
    xoff?: boolean | undefined;
    xany?: boolean | undefined;
    binding?: BaseBinding | undefined;
    bindingOptions?: {
      vmin?: number | undefined;
      vtime?: number | undefined;
    } | undefined;
  }
  interface UpdateOptions {
    baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number | undefined;
  }
  interface SetOptions {
    brk?: boolean | undefined;
    cts?: boolean | undefined;
    dsr?: boolean | undefined;
    dtr?: boolean | undefined;
    rts?: boolean | undefined;
  }

  interface PortInfo {
    path: string;
    manufacturer?: string | undefined;
    serialNumber?: string | undefined;
    pnpId?: string | undefined;
    locationId?: string | undefined;
    productId?: string | undefined;
    vendorId?: string | undefined;
  }
  class BaseBinding {
    constructor(options: any);

    open(path: string, options: OpenOptions): Promise<any>;
    close(): Promise<any>;

    read(data: Buffer, offset: number, length: number): Promise<any>;
    write(data: Buffer): Promise<any>;
    update(options?: UpdateOptions): Promise<any>;
    set(options?: SetOptions): Promise<any>;
    get(): Promise<any>;
    flush(): Promise<any>;
    drain(): Promise<any>;
    static list(): Promise<PortInfo[]>;
  }
}
export = SerialPortBean