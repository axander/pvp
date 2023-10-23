import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-gestor-container',
  templateUrl: './gestor-container.component.html',
  styleUrls: ['./gestor-container.component.scss']
})
export class GestorContainerComponent implements OnInit {
  appLstnr: Subscription = new Subscription;
  visible?: boolean;
  gestorContainerDirection!: string;
  gestorHidden!: boolean;
  constructor(
    private appSvc: AppService
  ) { }
  ngOnInit() {
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      console.log(data);
      this.visible = data.visible_responsive;
      this.gestorContainerDirection = data['gestor_position']!;
      this.gestorHidden = data['gestor_hidden']!;
    });
  }
  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }

}
