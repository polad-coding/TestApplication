"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
var app_settings_service_1 = require("./app-settings.service");
var EmailSenderService = /** @class */ (function () {
    function EmailSenderService(http) {
        this.http = http;
        this.url = app_settings_service_1.AppSettingsService.CURRENT_DOMAIN;
    }
    //  Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId);
    //Task < List < ValueModel >> GetFirstStageValuesAsync(int surveyId);
    //Task < List < ValueModel >> GetSecondStageValuesAsync(int surveyId);
    EmailSenderService.prototype.SendReciept = function (messages) {
        return this.http.post("https://" + this.url + "/EmailSender/SendReciept", messages, { observe: "response" });
    };
    return EmailSenderService;
}());
exports.EmailSenderService = EmailSenderService;
//# sourceMappingURL=email-sender-service.js.map