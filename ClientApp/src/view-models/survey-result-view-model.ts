import { UserViewModel } from "./user-view-model";

export class SurveyResultViewModel {
  public code: string;
  public takenOn: string;
  public surveyId: number;
  public practitionerFullName: string;
  public practitionerId: string;
  public isCompleated: boolean;
  public firstStagePassed: boolean;
  public takersEmail: string;
  public surveyTakerUser: UserViewModel;

  constructor(code, takenOn, surveyId, practitionerFullName, practitionerId, isCompleated, takersEmail) {
    this.code = code;
    this.takenOn = takenOn;
    this.surveyId = surveyId;
    this.practitionerFullName = practitionerFullName;
    this.practitionerId = practitionerId;
    this.isCompleated = isCompleated;
    this.takersEmail = takersEmail;
  }

}
