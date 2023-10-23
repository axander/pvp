import { Component, Input, OnInit } from '@angular/core';
import { ItemGestor } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  @Input("data") data$!: ItemGestor;

  constructor(
    private appSvc: AppService
  ) { }
  ngOnInit() {

  }

  change(e: Event) {
    this.data$.value = e;
    this.appSvc.update();
  }
 

}