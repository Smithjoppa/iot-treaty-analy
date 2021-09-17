"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CrcUtil = /** @class */ (function () {
    function CrcUtil() {
    }
    CrcUtil.prototype.checkCrc = function (rawData) {
        var rawDataLength = rawData.length;
        var crc = this.genCrc(rawData.slice(0, rawDataLength - 2)); // 原始数据 - crc 然后进行crc校验
        var crcCheck = this.byteToNumber(crc);
        var crcValue = this.byteToNumber(rawData.slice(rawDataLength - 2, rawDataLength));
        return crcCheck === crcValue;
    };
    CrcUtil.prototype.genCrc = function (data) {
        var flag;
        var wcrc = 0xffff;
        var length = data.length;
        for (var i = 0; i < length; i++) {
            wcrc = wcrc ^ data[i];
            for (var j = 0; j < 8; j++) {
                flag = wcrc & 0x0001;
                wcrc = wcrc >> 1;
                if (flag === 1)
                    wcrc ^= 0xa001;
            }
        }
        var low = wcrc >> 8; // 获取低八位
        var up = wcrc % 256; // 获取高八位
        var crc = [up, low];
        return crc;
    };
    CrcUtil.prototype.byteToNumber = function (bytes) {
        var value = 0;
        for (var i = 0; i < 2; i++) {
            var shift = (2 - 1 - i) * 8;
            value += (bytes[i] & 0xffff) << shift; // 往高位游
        }
        return value;
    };
    CrcUtil.prototype.byteArray2Int = function (b) {
        var value = 0;
        for (var i = b.length - 1; i >= 0; i--) {
            var shift = (b.length - 1 - i) * 8;
            value += (b[i] & 0x000000ff) << shift;
        }
        return value;
    };
    return CrcUtil;
}());
exports.default = CrcUtil;
