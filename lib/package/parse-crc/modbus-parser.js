"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../../utils/index"));
var stream_1 = require("stream");
/**
 * options : needMBHeader 是否显示modbus协议头，默认true
 */
var ModbusParser = /** @class */ (function (_super) {
    __extends(ModbusParser, _super);
    function ModbusParser(options) {
        var _this = _super.call(this, options) || this;
        _this.listenLoopSize = 0;
        _this.crcUtil = new index_1.default();
        if (options.moduleNum === undefined) {
            throw new TypeError('"moduleNum" is not a bufferable object');
        }
        if (options.moduleNum.length === 0) {
            throw new TypeError('"moduleNum" has a 0 or undefined length');
        }
        // 是否包含分割符号
        _this.needMBHeader = options.needMBHeader !== undefined ? options.needMBHeader : true;
        _this.resetModuleNum(options.moduleNum);
        return _this;
    }
    ModbusParser.prototype.resetModuleNum = function (moduleNum) {
        var _this = this;
        this.delimiters = [];
        moduleNum.forEach(function (item) {
            _this.delimiters.push(item);
        });
        this.buffer = Buffer.alloc(0);
        this.listenLoopSize = this.delimiters.length;
    };
    ModbusParser.prototype._transform = function (chunk, _encoding, cb) {
        var isModbusStart = this.checkIsModbusStart(chunk); // 判断是不是起点
        if (isModbusStart) {
            this.buffer = Buffer.alloc(0);
        }
        this.buffer = Buffer.concat([this.buffer, chunk]);
        var crcIsLegal = this.crcUtil.checkCrc(this.buffer); // CRC验证，通过即返回
        // 
        if (crcIsLegal) {
            // 
            this.push(this.buffer.slice(this.needMBHeader ? 0 : 2));
        }
        else {
            // 
            // 
        }
        cb();
    };
    ModbusParser.prototype.checkIsModbusStart = function (chunk) {
        var isStart = false;
        for (var i = 0; i < this.listenLoopSize; i++) {
            var delimiter = this.delimiters[i];
            isStart = chunk.indexOf(Buffer.from(delimiter)) === 0;
            if (isStart) {
                return isStart;
            }
        }
        return isStart;
    };
    ModbusParser.prototype._flush = function (cb) {
        this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
        cb();
    };
    return ModbusParser;
}(stream_1.Transform));
exports.default = ModbusParser;
