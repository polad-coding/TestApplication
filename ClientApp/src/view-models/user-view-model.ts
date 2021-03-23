import { GenderViewModel } from "./gender-view-model";
import { LanguageViewModel } from "./language-view-model";
import { RegionViewModel } from "./region-view-model";

export class UserViewModel {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public age: number;
  public gender: GenderViewModel;
  public regions: Array<RegionViewModel>;
  public education: string;
  public sectorOfActivity: string;
  public professionalEmail: string;
  public bio: string;
  public languages: Array<LanguageViewModel>;
  public website: string;
  public myerBriggsCode: string;
  public accessToken: string;
  public refreshToken: string;
  public position: string;
  public profileImageName: string;
}
