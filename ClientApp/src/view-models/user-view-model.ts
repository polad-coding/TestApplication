import { AgeGroupViewModel } from "./age-group-view-model";
import { EducationViewModel } from "./education-view-model";
import { GenderViewModel } from "./gender-view-model";
import { LanguageViewModel } from "./language-view-model";
import { PositionViewModel } from "./position-view-model";
import { RegionViewModel } from "./region-view-model";
import { SectorOfActivityViewModel } from "./sector-of-activity-view-model";

export class UserViewModel {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public age: number;
  public gender: GenderViewModel;
  public regions: Array<RegionViewModel>;
  public educations: Array<EducationViewModel>;
  public sectorsOfActivities: Array<SectorOfActivityViewModel>;
  public professionalEmail: string;
  public bio: string;
  public languages: Array<LanguageViewModel>;
  public website: string;
  public myerBriggsCode: string;
  public accessToken: string;
  public refreshToken: string;
  public positions: Array<PositionViewModel>;
  public profileImageName: string;
  public phoneNumber: string;
  public ageGroup: AgeGroupViewModel;
}
