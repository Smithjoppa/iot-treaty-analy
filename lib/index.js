"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var utils_1 = __importDefault(require("./utils"));
var iot_serial_port_1 = __importDefault(require("./package/hooks/iot-serial-port"));
var iot_socket_1 = __importDefault(require("./package/hooks/iot-socket"));
var typeModel;
(function (typeModel) {
    typeModel[typeModel["IotSerialPort"] = 0] = "IotSerialPort";
    typeModel[typeModel["IotSocket"] = 1] = "IotSocket";
})(typeModel || (typeModel = {}));
var IotConnect = /** @class */ (function () {
    function IotConnect(type) {
        this.type = type;
    }
    IotConnect.prototype.configSerial = function (path, options) {
        this.path = path;
        this.options = options;
    };
    IotConnect.prototype.configSocket = function (host, port) {
        this.host = host;
        this.port = port;
    };
    IotConnect.prototype.write = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.msgQueue.write(msg, function (buf) {
                resolve(buf);
            });
        });
    };
    IotConnect.prototype.close = function () {
        try {
            this.channel.close();
        }
        catch (error) {
            throw new Error(error + "");
        }
    };
    IotConnect.prototype.initStartChannel = function () {
        if (this.type === typeModel.IotSerialPort) {
            this.channel = initSerialPort(this.path, this.options);
            if (lodash_1.default.isEmpty(this.channel.parse)) {
                throw new Error("this serial parse is undefined");
            }
            // Set the serial port channel to be sent
            this.msgQueue = MsgQueue.getInstance(this.channel.parse, this.channel);
        }
        if (this.type === typeModel.IotSocket) {
            this.channel = initSocket(this.host, this.port);
            //Set the net channel to be sent
            this.msgQueue = MsgQueue.getInstance(this.channel.server, this.channel);
        }
    };
    return IotConnect;
}());
var MsgQueue = /** @class */ (function () {
    function MsgQueue(listenObj, channel) {
        this._busy = false;
        this._listenObj = listenObj;
        this._channel = channel;
        this.setListenObj(listenObj);
    }
    MsgQueue.getInstance = function (serial, channel) {
        if (!this._instance) {
            this._instance = new MsgQueue(serial, channel);
        }
        return this._instance;
    };
    MsgQueue.prototype.write = function (data, callback) {
        this._queue.unshift([data, callback]);
        if (this._busy)
            return;
        this._busy = true;
        this.processQueue();
    };
    MsgQueue.prototype.setListenObj = function (listenObj) {
        var _this = this;
        this._listenObj = listenObj;
        if (this._channel instanceof iot_serial_port_1.default) {
            this._listenObj.on('data', function (data) {
                if (!_this._current)
                    return;
                // get buffer and return to callback
                _this._current[1](data);
                _this.processQueue();
            });
        }
        else {
            this._listenObj.on('connection', function (socket) {
                // data 事件就是读取数据
                socket.on('data', function (data) {
                    var msg = data;
                    var channelId = MsgQueue.util.byteArray2Int([msg[0], msg[1]]);
                    if (MsgQueue.util.byteArray2Int([msg[2], msg[3]]) && data.length === 4) {
                        console.log('device Code', channelId);
                        return;
                    }
                    if (!_this._current)
                        return;
                    //get buffer and return to callback
                    _this._current[1](data);
                    _this.processQueue();
                });
            });
        }
    };
    MsgQueue.prototype.processQueue = function () {
        var next = this._queue.shift();
        if (!next) {
            this._busy = false;
            return;
        }
        this._current = next;
        console.log(next[0]);
        this._channel.write(next[0]);
    };
    MsgQueue.util = new utils_1.default();
    return MsgQueue;
}());
function initSerialPort(path, options) {
    if (lodash_1.default.isEmpty(path)) {
        throw new Error("serial port path is undefined");
    }
    if (lodash_1.default.isEmpty(options)) {
        throw new Error("options is undefined");
    }
    var SerialPort = iot_serial_port_1.default.getInstance("SerialPort");
    SerialPort.connect(path, options);
    return SerialPort;
}
function initSocket(host, prot) {
    if (lodash_1.default.isEmpty(host)) {
        throw new Error("host is undefined");
    }
    if (lodash_1.default.isEmpty(prot)) {
        throw new Error("port is undefined");
    }
    var socket = iot_socket_1.default.getInstance("Socket");
    return socket;
}
exports.default = IotConnect;
