import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Icon, ItemGestor } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-config-container',
  templateUrl: './config-container.component.html',
  styleUrls: ['./config-container.component.scss']
})
export class ConfigContainerComponent implements OnInit {
  appLstnr: Subscription = new Subscription;
  options$!:ItemGestor[];
  gestorHidden!:boolean;
  closeIcon!:Icon;
  constructor(
    private appSvc: AppService
  ) { }
  ngOnInit() {
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      this.options$= data.gestor.options;
      this.gestorHidden = data['gestor_hidden']!;
      this.closeIcon = data.icons?.find((x:Icon)=> x.id=="closePB-icon")!;
    })
  }
  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
  close(e: Event) {
    this.appSvc.toogleConfig();
  }

}