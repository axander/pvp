import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderingExtraItem } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';
import { VersionService } from 'src/app/services/version.service';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {
  ordering_spinner?: string;
  extra!: string;
  action!: string;
  message!: string;
  percentage!: number;
  appLstnr: Subscription = new Subscription;

  constructor(
    private versionSvc: VersionService,
    private appSvc: AppService
  ) {
    this.ordering_spinner = versionSvc.getOrderingSpinner();
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      if (!data.configFocused) {
        this.action = data.ordering_action!;
        this.message = data.ordering_message!;
        this.percentage = data.ordering_percentage!;
        this.extra = this.appSvc.currentAppValue['ordering_disclaimers_aleatory'] && this.appSvc.currentAppValue['ordering_disclaimers_aleatory']['active']
          ? this.appSvc.currentAppValue['ordering_disclaimers_aleatory_extra']
          : data.ordering_extra?.collection!.find((x: OrderingExtraItem) => x.selected)!.code!
      }
    })
  }
  ngOnInit() { }

  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }

}
