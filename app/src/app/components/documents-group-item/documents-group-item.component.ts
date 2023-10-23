import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileItem, Group } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-documents-group-item',
  templateUrl: './documents-group-item.component.html',
  styleUrls: ['./documents-group-item.component.scss']
})

export class DocumentsGroupItemComponent implements OnInit {
  @Input("group") group$!: Group;
  @Input("data") data$!: FileItem;
  @Input("mode") mode!: string;
  @Output("callbackFile") callbackFile: EventEmitter<{ file?: FileItem, action: string }> = new EventEmitter<{ file?: FileItem, action: string }>();

  constructor(
    private appSvc: AppService
  ) { }

  ngOnInit() { }

  deleteFile(_data: FileItem) {
    let itemSelected: boolean = _data.selected!;
    this.group$.files.map(x => {
      if (itemSelected) {
        if (_data.index == 1) {
          x.index == this.data$.index + 1 ? x.selected = true : null;
        } else {
          x.index == this.data$.index - 1 ? x.selected = true : null;
        }
      }
      x.index > this.data$.index ? x.index = x.index - 1 : null
    });
    this.group$.files = this.group$.files.filter(x => x.id != this.data$.id);
    this.updateApp();
    
    if (this.group$.files.length) {
      
      this.callbackFile.emit({ file: this.group$.files.find((x: FileItem) => x.selected), action: 'select' });
    } else {
      this.callbackFile.emit({ file: undefined, action: 'empty' });
    };

  }

  selectFile(_data: FileItem) {
    this.group$.files.map(x => x.selected = false);
    this.data$.selected = true;
    //this.callbackFile.emit({ file: _data, action: 'select' });
  }

  //drag and drop
  public onZoneEvent(event: any) {

  }

  updateApp() {
    let ss: Group = this.appSvc.currentAppValue.groups.find((x: Group) => x.id == this.group$.id)!;
    ss ? ss = this.group$ : null;
    this.appSvc.currentAppValue.gestor = this.group$.gestor;
    this.appSvc.currentAppSubject.next(this.appSvc.currentAppValue);
  }

}
