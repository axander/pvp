import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { ErrorGroupItem, FileItem, FileItemInfo, Group } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';
import { Rules } from 'src/app/utils/rules';

@Component({
  selector: 'app-document-group-error',
  templateUrl: './document-group-error.component.html',
  styleUrls: ['./document-group-error.component.scss']
})
export class DocumentGroupErrorComponent implements OnInit {

  @Input("id") id?: number;

  errors!: ErrorGroupItem[];
  appLstnr: Subscription = new Subscription();

  constructor(
    private appSvc: AppService
  ) {
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      console.log(this.id);
      !this.id ? this.id = data.gestorFocusedId : null;
      console.log(data);
      let matchGroup: Group = data.groups.find(y => y.id == this.id)!;
      this.errors = [];
      let numPages = 0;
      console.log(matchGroup);
      if (matchGroup) {
        matchGroup.files.map((x: FileItem) => numPages = numPages + x.finalNumPages!);
        matchGroup.gestor.options.find(x => x['id'] == "finished")?.options?.find(y => y["id"] == "stapled")!.selected
          && this.appSvc.currentAppValue['rules'] && this.appSvc.currentAppValue['rules']['stapled']["value"]
          ? this.appSvc.currentAppValue['rules']['stapled']["value"] < numPages && !this.errors.find(x => x.id == 'stapled')
            ? this.errors.push({ id: 'stapled', html: this.appSvc.currentAppValue['rules']['stapled']["html"] })
            : this.errors = this.errors.filter(x => x.id != 'stapled')
          : null;
        matchGroup.gestor.options.find(x => x['id'] == "finished")?.options?.find(y => y["id"] == "stapled-creased")!.selected
          && this.appSvc.currentAppValue['rules'] && this.appSvc.currentAppValue['rules']['stapled-creased']["value"]
          ? this.appSvc.currentAppValue['rules']['stapled-creased']["value"] < numPages && !this.errors.find(x => x.id == 'stapled-creased')
            ? this.errors.push({ id: 'stapled-crease', html: this.appSvc.currentAppValue['rules']['stapled-creased']["html"] })
            : this.errors = this.errors.filter(x => x.id != 'stapled-creased')
          : null;
      }

    })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
}
