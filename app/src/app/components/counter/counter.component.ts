import { Component, Input, OnInit } from '@angular/core';
import { ItemGestor } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  @Input("data") data$!: ItemGestor;

  constructor(
    private appSvc: AppService
  ) { }
  ngOnInit() {

  }
  decrement(e: Event) {
    this.data$.value > 1 ? this.data$.value-- : null;
    this.appSvc.update();
  }
  increment(e: Event) {
    this.data$.value++;
    this.appSvc.update();
  }
  change(e: Event) {
    this.data$.value = e;
    this.appSvc.update();
  }

}
