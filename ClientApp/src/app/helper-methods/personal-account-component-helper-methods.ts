import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AgeGroupViewModel } from "../../view-models/age-group-view-model";
import { EducationViewModel } from "../../view-models/education-view-model";
import { PositionViewModel } from "../../view-models/position-view-model";
import { RegionViewModel } from "../../view-models/region-view-model";
import { SectorOfActivityViewModel } from "../../view-models/sector-of-activity-view-model";

@Injectable()
export class PersonalAccountComponentHelperMethods {

  constructor(private _jwtHelper: JwtHelperService, private _router: Router) {

  }

  public DecideIfJwtTokenIsValid():void {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'Practitioner') {
      this._router.navigate(['practitionerAccount']);
    }
  }

  public GetCurrentTab(): string {
    let currentTab = localStorage.getItem('personalAccountTabName');

    if (currentTab == null) {
      localStorage.setItem('personalAccountTabName', 'my-account-section');
      currentTab = localStorage.getItem('personalAccountTabName');
    }

    return currentTab;
  }

  public ModalTypeFieldsAreNotEmpty(regions: Array<RegionViewModel>, educations: Array<EducationViewModel>, positions: Array<PositionViewModel>, sectorsOfActivities: Array<SectorOfActivityViewModel>, ageGroup: AgeGroupViewModel): boolean {
    if (regions.length > 0 && educations.length > 0 && positions.length > 0 && sectorsOfActivities.length > 0 && ageGroup != undefined) {
      return true;
    }

    return false;
  }

}
