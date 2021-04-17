"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
var core_1 = require("@angular/core");
core_1.Injectable();
var DataService = /** @class */ (function () {
    function DataService(http) {
        this.http = http;
        this.url = 'localhost:5001';
    }
    DataService.prototype.GetAllValues = function () {
        return this.http.get("https://" + this.url + "/Data/GetAllValues", { observe: 'response' });
    };
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data-service.js.map