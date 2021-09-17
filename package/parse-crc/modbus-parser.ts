import CrcUtil from "../../utils/index";

const { Transform } = require('stream')

/**
 * options : needMBHeader 是否显示modbus协议头，默认true
 */
export default class ModbusParser extends Transform {
  crcUtil: CrcUtil
  listenLoopSize: number = 0
  constructor(options: any) {
    super(options)
    this.crcUtil = new CrcUtil();
    if (options.moduleNum === undefined) {
      throw new TypeError('"moduleNum" is not a bufferable object')
    }
    if (options.moduleNum.length === 0) {
      throw new TypeError('"moduleNum" has a 0 or undefined length')
    }
    // 是否包含分割符号
    this.needMBHeader = options.needMBHeader !== undefined ? options.needMBHeader : true
    this.resetModuleNum(options.moduleNum)
  }

  resetModuleNum(moduleNum) {
    this.delimiters = []
    moduleNum.forEach(item => {
      this.delimiters.push(item)
    })

    this.buffer = Buffer.alloc(0)
    this.listenLoopSize = this.delimiters.length
  }

  _transform(chunk, encoding, cb) {
    const isModbusStart = this.checkIsModbusStart(chunk) // 判断是不是起点
    if (isModbusStart) {
      this.buffer = Buffer.alloc(0)
    }
    this.buffer = Buffer.concat([this.buffer, chunk])
    const crcIsLegal = this.crcUtil.checkCrc(this.buffer) // CRC验证，通过即返回
    // 
    if (crcIsLegal) {
      // 
      this.push(this.buffer.slice(this.needMBHeader ? 0 : 2))
    } else {
      // 
      // 
    }
    cb()
  }

  checkIsModbusStart(chunk: Buffer) {
    let isStart = false
    for (let i = 0; i < this.listenLoopSize; i++) {
      const delimiter: Uint8Array = this.delimiters[i]
      isStart = chunk.indexOf(Buffer.from(delimiter)) === 0
      if (isStart) {
        return isStart
      }
    }
    return isStart
  }

  _flush(cb) {
    this.push(this.buffer)
    this.buffer = Buffer.alloc(0)
    cb()
  }
}
