"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderViewModel = void 0;
var OrderViewModel = /** @class */ (function () {
    function OrderViewModel(id, numberOfCodes, numberOfSurveys, pricePerUnit, discoutCoupon, totalPrice, defaultNumberOfUsages) {
        this.id = id;
        this.numberOfCodes = numberOfCodes;
        this.numberOfUsages = numberOfSurveys;
        this.pricePerUnit = pricePerUnit;
        this.couponBody = discoutCoupon;
        this.totalPrice = totalPrice;
        this.defaultNumberOfUsages = defaultNumberOfUsages;
    }
    return OrderViewModel;
}());
exports.OrderViewModel = OrderViewModel;
//# sourceMappingURL=order-view-model.js.map