import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [DeviceDetectorService]
})
export class TestComponent implements OnInit {

  constructor(private _deviceDetectorService: DeviceDetectorService) { }

  ngOnInit() {
    console.log(this._deviceDetectorService.getDeviceInfo());
    console.log(this._deviceDetectorService.isDesktop());
    console.log(this._deviceDetectorService.isMobile());
    console.log(this._deviceDetectorService.isTablet());
    console.log(this._deviceDetectorService.device);
  }

}
