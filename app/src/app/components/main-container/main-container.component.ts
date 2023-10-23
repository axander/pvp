/*import { HttpClient } from '@angular/common/http';*/
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  constructor(
    private appSvc: AppService
  ) {}
  ngOnInit() {}
  activeApp(e:Event) {
    console.log("iniciar");
    this.appSvc.gestorActivate();
  }
 
}
