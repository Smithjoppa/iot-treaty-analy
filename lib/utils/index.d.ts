export default class CrcUtil {
    constructor();
    checkCrc(rawData: string | any[]): boolean;
    genCrc(data: string | any[]): number[];
    byteToNumber(bytes: string | any[]): number;
    byteArray2Int(b: string | any[]): number;
}
