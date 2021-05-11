"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyResultViewModel = void 0;
var SurveyResultViewModel = /** @class */ (function () {
    function SurveyResultViewModel(code, takenOn, surveyId, practitionerFullName, practitionerId, isCompleated, takersEmail) {
        this.code = code;
        this.takenOn = takenOn;
        this.surveyId = surveyId;
        this.practitionerFullName = practitionerFullName;
        this.practitionerId = practitionerId;
        this.isCompleated = isCompleated;
        this.takersEmail = takersEmail;
    }
    return SurveyResultViewModel;
}());
exports.SurveyResultViewModel = SurveyResultViewModel;
//# sourceMappingURL=survey-result-view-model.js.map