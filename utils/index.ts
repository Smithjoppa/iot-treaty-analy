


export default class CrcUtil {
  constructor() {
  }
  checkCrc(rawData: string | any[]) {
    const rawDataLength = rawData.length
    const crc = this.genCrc(rawData.slice(0, rawDataLength - 2)) // 原始数据 - crc 然后进行crc校验
    const crcCheck = this.byteToNumber(crc)
    const crcValue = this.byteToNumber(rawData.slice(rawDataLength - 2, rawDataLength))
    return crcCheck === crcValue
  }
  genCrc(data: string | any[]) {
    let flag
    let wcrc = 0xffff
    const length = data.length
    for (let i = 0; i < length; i++) {
      wcrc = wcrc ^ data[i]
      for (let j = 0; j < 8; j++) {
        flag = wcrc & 0x0001
        wcrc = wcrc >> 1
        if (flag === 1) wcrc ^= 0xa001
      }
    }
    const low = wcrc >> 8 // 获取低八位
    const up = wcrc % 256 // 获取高八位
    const crc = [up, low]
    return crc
  }
  byteToNumber(bytes: string | any[]) {
    let value = 0
    for (let i = 0; i < 2; i++) {
      const shift = (2 - 1 - i) * 8
      value += (bytes[i] & 0xffff) << shift // 往高位游
    }
    return value
  }
  byteArray2Int(b: string | any[]) {
    let value = 0
    for (let i = b.length - 1; i >= 0; i--) {
      const shift = (b.length - 1 - i) * 8
      value += (b[i] & 0x000000ff) << shift
    }
    return value
  }
}