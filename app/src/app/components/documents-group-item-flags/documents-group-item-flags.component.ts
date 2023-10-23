import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject, Subscription, of } from 'rxjs';
import { FileItem, Group, ItemGestor, ItemOptionGestor, ThumbnailItem } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-documents-group-item-flags',
  templateUrl: './documents-group-item-flags.component.html',
  styleUrls: ['./documents-group-item-flags.component.scss']
})
export class DocumentsGroupItemFlagsComponent implements OnInit {


  readonly data$ = new ReplaySubject<ItemGestor[]>(1);
  @Input("data") set data(value: ItemGestor[]) {
    this.data$.next(value);
  }

  readonly files$ = new ReplaySubject<FileItem[]>(1);
  @Input("files") set files(value: FileItem[]) {
    this.files$.next(value);
  }

  flags$!: string[];
  partialFlags$!: string[];

  dataLstnr: Subscription = new Subscription;
  appLstnr: Subscription = new Subscription;
  constructor(
    private appSvc: AppService,
    public translateSvc: TranslateService
  ) {
    this.dataLstnr = this.data$.subscribe(data => {
      this.flags$ = [];
      data?.map(itemGestor => {
        let matchItem: ItemOptionGestor = itemGestor.options?.find(x => x.selected)!;
        if (matchItem && itemGestor["active"]) {
          let rot: string = matchItem!['flag'] && matchItem!['active'] ? matchItem['flag']!['content'] : matchItem.rot.text;
          rot && rot.length ? this.flags$.push(rot) : null;
        }
      });
    })
    this.appSvc.currentAppSubject.subscribe(data => {
      if (!data.configFocused) {
        this.partialFlags$ = [];
        let matchGroup = data.groups.find((x: Group) => x.id == data.gestorFocusedId)!;
        let colored: number = 0;
        let notColored: number = 0;
        let totalThumbnails: number = 0;
        let rotated: boolean = false;
        let perPage: boolean = false;
        if (matchGroup) {
          let matchPerPage: ItemOptionGestor = matchGroup.gestor.options.find((x: ItemGestor) => x["id"] == "slide_per_page")!.options!.find((x: ItemOptionGestor) => x.selected)!;
          matchGroup.files.map((x: FileItem) => {
            x.config?.rotation ? rotated = true : null;
            x.finalThumbnails?.map((y: ThumbnailItem) => y.color ? colored++ : notColored++);
            x.finalThumbnails ? totalThumbnails = totalThumbnails + x.finalThumbnails.length : null;
            matchPerPage ? x.config?.perPage != matchPerPage["value"] ? perPage = true : null : null;
          });
          colored && (colored != totalThumbnails) ? this.partialFlags$.push(this.translateSvc.instant('GENERIC.ORDER.SOME_COLORED')) : null;
          notColored && (notColored != totalThumbnails) ? this.partialFlags$.push('GENERIC.ORDER.SOME_NOT_COLORED') : null;
          rotated ? this.partialFlags$.push('GENERIC.ORDER.SOME_ROTATED') : null;
          perPage ? this.partialFlags$.push('GENERIC.ORDER.SOME_PERPAGE') : null;
        }

      }

    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.dataLstnr.unsubscribe();
  }

}
