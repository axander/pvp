import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  constructor(
    private appSvc:AppService
  ){

  }

  ngOnInit(): void {
    
  }

  toogleIntro(){
    this.appSvc.setAnyParam('intro_active',false);
  }
}


