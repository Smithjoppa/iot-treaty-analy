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
var net_1 = __importDefault(require("net"));
var IotSocket = /** @class */ (function (_super) {
    __extends(IotSocket, _super);
    function IotSocket(requestType) {
        var _this = _super.call(this, requestType) || this;
        _this.requestType = requestType;
        return _this;
    }
    IotSocket.prototype.setConfigNet = function (HOST, PORT) {
        this.HOST = HOST;
        this.PORT = PORT;
    };
    IotSocket.prototype.connect = function (start) {
        var _this = this;
        var _a;
        this.server = net_1.default.createServer(function (clientSocket) {
            console.log("\u8FDE\u63A5\u5BA2\u6237\u7AEFIp: " + clientSocket.remoteAddress + ":" + clientSocket.remotePort);
            clientSocket.on('end', function () {
                console.log("\u5BA2\u6237\u7AEF\u65AD\u5F00\u8FDE\u63A5:" + (clientSocket === null || clientSocket === void 0 ? void 0 : clientSocket.remoteAddress) + ":" + (clientSocket === null || clientSocket === void 0 ? void 0 : clientSocket.remotePort));
            });
        });
        (_a = this.server) === null || _a === void 0 ? void 0 : _a.listen(this.PORT, this.HOST);
        this.server.on("listening", function () {
            console.log("\u5F00\u542F\u670D\u52A1" + _this.PORT);
        });
        this.server.on("error", function (err) {
            console.log("error:" + err);
            throw new Error("error:" + err);
        });
        this.server.on("connection", function (socket) {
            socket.on('data', function (msg) {
                var channelId = _this.byteArray2Int([msg[0], msg[1]]);
                if (_this.byteArray2Int([msg[2], msg[3]]) && msg.length === 4) {
                    _this.clientSocks['client-' + channelId] = socket;
                    if (!lodash_1.default.isEmpty(start)) {
                        start();
                    }
                }
            });
        });
    };
    IotSocket.prototype.close = function () {
        var _this = this;
        return new Promise(function (resolve, _reject) {
            var _a;
            for (var key in _this.clientSocks) {
                _this.clientSocks[key].destroy();
            }
            (_a = _this.server) === null || _a === void 0 ? void 0 : _a.close();
            _this.server = null;
            resolve("success");
        });
    };
    IotSocket.prototype.write = function (msg) {
        var _this = this;
        var client = this.clientSocks['client-' + msg[0]];
        if (!lodash_1.default.isEmpty(client))
            return new Promise(function (resolve, reject) {
                var _a;
                client.write(msg);
                (_a = _this.server) === null || _a === void 0 ? void 0 : _a.on("connection", function (socket) {
                    socket.on('data', function (msg) {
                        if (_this.byteArray2Int([msg[2], msg[3]]) && msg.length === 4) {
                            reject();
                        }
                        else {
                            resolve(msg);
                        }
                    });
                });
            });
        throw new Error("no response.");
    };
    IotSocket.prototype.byteArray2Int = function (b) {
        var value = 0;
        for (var i = b.length - 1; i >= 0; i--) {
            var shift = (b.length - 1 - i) * 8;
            value += (b[i] & 0x000000ff) << shift;
        }
        return value;
    };
    IotSocket.getInstance = function (requestType) {
        if (!IotSocket.instance) {
            IotSocket.instance = new IotSocket(requestType);
        }
        return IotSocket.instance;
    };
    return IotSocket;
}(BaseGet));
exports.default = IotSocket;
