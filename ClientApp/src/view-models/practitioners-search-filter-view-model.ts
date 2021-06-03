import { GenderViewModel } from "./gender-view-model";
import { LanguageViewModel } from "./language-view-model";
import { RegionViewModel } from "./region-view-model";

export class PractitionersSearchFilterViewModel {
  public startingIndex: number;
  public endingIndex: number;
  public languagesSelected: Array<LanguageViewModel> = new Array<LanguageViewModel>();
  public geographicalLocationsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public genderSelected: GenderViewModel;
}
