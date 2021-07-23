import { Injectable } from '@angular/core';

@Injectable()
export class AppSettingsService {

  public static readonly NUMBER_OF_PERSPECTIVES = 6;
  //public static readonly CURRENT_DOMAIN = 'localhost:5001';
  public static readonly CURRENT_DOMAIN = 'somefreedomain.ml'; 


  constructor() { }
}
