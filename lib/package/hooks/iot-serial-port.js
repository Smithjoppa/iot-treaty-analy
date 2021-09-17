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
var lodash_1 = __importDefault(require("lodash"));
var types_1 = require("../../types");
var modbus_parser_1 = __importDefault(require("../parse-crc/modbus-parser"));
var SerialPort = require('serialport');
var IotSerialPort = /** @class */ (function (_super) {
    __extends(IotSerialPort, _super);
    function IotSerialPort(requestType) {
        var _this = _super.call(this, requestType) || this;
        _this.requestType = requestType;
        return _this;
    }
    IotSerialPort.prototype.connect = function (path, options) {
        var _this = this;
        if (lodash_1.default.isEmpty(path)) {
            throw new Error("COM is Null.");
        }
        this.option = options;
        this.serialport = new SerialPort(path, options);
        return new Promise(function (resolve, reject) {
            var _a, _b;
            (_a = _this.serialport) === null || _a === void 0 ? void 0 : _a.on('open', function (msg) {
                resolve(msg);
            });
            (_b = _this.serialport) === null || _b === void 0 ? void 0 : _b.on('error', function (err) {
                reject(err);
            });
        });
    };
    IotSerialPort.prototype.close = function () {
        var _this = this;
        this.throwErrorSerialport();
        return new Promise(function (resolve, _reject) {
            _this.serialport.close(function (res) {
                resolve(res);
            });
        });
    };
    IotSerialPort.prototype.write = function (msg) {
        var _this = this;
        this.throwErrorSerialport();
        this.serialport.flush();
        return new Promise(function (resolve, reject) {
            var _a;
            (_a = _this.serialport) === null || _a === void 0 ? void 0 : _a.write(msg, function (_res) {
                var _a;
                (_a = _this.parse) === null || _a === void 0 ? void 0 : _a.on("data", function (message) {
                    resolve(message);
                });
            });
        });
    };
    IotSerialPort.prototype.update = function (op) {
        this.serialport.update(op);
        throw new Error("Method not implemented.");
    };
    /**
     * 分割数据头
     * @param moduleNum 模块编号
     */
    IotSerialPort.prototype.resetModuleNum = function (moduleNum) {
        if (lodash_1.default.isEmpty(this.serialport)) {
            throw new Error("serialport is undefined.");
        }
        this.parse = new modbus_parser_1.default({ moduleNum: moduleNum, needMBHeader: true });
        this.serialport.pipe(this.parse);
    };
    IotSerialPort.prototype.listPort = function () {
        this.throwErrorSerialport();
        return this.serialport.list();
    };
    IotSerialPort.prototype.throwErrorSerialport = function () {
        if (lodash_1.default.isEmpty(this.serialport)) {
            throw new Error("serialport is null");
        }
    };
    IotSerialPort.getInstance = function (requestType) {
        if (!IotSerialPort.instance) {
            IotSerialPort.instance = new IotSerialPort(requestType);
        }
        return IotSerialPort.instance;
    };
    return IotSerialPort;
}(types_1.BaseGet));
exports.default = IotSerialPort;
