import { group } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { FileItem, Gestor, Group, ItemGestor, ItemOptionGestor, ThumbnailItem } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';
import { Rules } from 'src/app/utils/rules';

@Component({
  selector: 'app-documents-group-item-footer',
  templateUrl: './documents-group-item-footer.component.html',
  styleUrls: ['./documents-group-item-footer.component.scss']
})
export class DocumentsGroupItemFooterComponent implements OnInit {

  @Input("id") id!: number;

  readonly data$ = new ReplaySubject<Gestor>(1);
  @Input("data") set data(value: Gestor) {
    this.data$.next(value);
  }

  readonly files$ = new ReplaySubject<FileItem[]>(1);
  @Input("files") set files(value: FileItem[]) {
    this.files$.next(value);
  }
  filesArray!: FileItem[];

  weight!: string;
  copies!: number;
  pages!: number;
  sheets!: number;
  ammount: number = 0;
  ammountFinished: number = 0;

  flags$!: string[];

  appLstnr: Subscription = new Subscription;

  itemRef!: string;

  constructor(
    private appSvc: AppService
  ) {
    this.itemRef = this.appSvc.currentAppValue["item-ref"]["id"];
    this.files$.subscribe((data: FileItem[]) => {
      if (!this.appSvc.currentAppValue.configFocused) {
        this.filesArray = data;
        let weight: number = 0;
        this.pages = 0;
        this.sheets = 0;
        data.map(x => {
          console.log(x.numPages);
          let finalPages = 0;
          x.finalThumbnails ? finalPages = x.finalThumbnails.length : null;
          x.config ? this.pages = this.pages + x.finalNumPages! : null;
          this.sheets = this.sheets + x.finalSheets!;
          weight = weight + x.info.totalBytes
        });
        this.weight = this.getFinalWeight(weight);
        let matchGroup: Group = this.appSvc.currentAppValue.groups.find((x: Group) => x.id == this.id)!;
        if (matchGroup) {
          this.copies = matchGroup.gestor.options.find(x => x.type == "counter")?.value;
          this.ammount = this.getAmmountNest(matchGroup.gestor.options, matchGroup.files, this.copies);
        }
      }
    });
    this.data$.subscribe(data => {
      if (!this.appSvc.currentAppValue.configFocused) {
        this.copies = data.options.find(x => x.type == "counter")?.value;
        this.ammount = this.getAmmountNest(data.options, this.filesArray, this.copies);
      }
    });
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      if (!data.configFocused) {
        this.pages = 0;
        this.sheets = 0;
        let matchGroup: Group = data.groups.find((y: Group) => y.id == this.id)!;
        if (matchGroup) {
          matchGroup.files.map(x => {
            console.log(x.numPages);
            let finalPages = 0;
            x.finalThumbnails ? finalPages = x.finalThumbnails.length : null;
            this.pages = this.pages + x.finalNumPages!;
            this.sheets = this.sheets + x.finalSheets!;
          })
          this.copies = matchGroup.gestor.options.find(x => x.type == "counter")?.value;
          this.ammount = this.getAmmountNest(matchGroup.gestor.options, matchGroup.files, this.copies);
        }
      }
    })
  }

  ngOnInit() { }

  private getFinalWeight(_bytes: number) {
    let totalBytes: number = _bytes;
    let measure: string = "";
    let size: number = 0;
    if (totalBytes < 1000000) {
      measure = "KB";
      size = Number((totalBytes / 1000).toFixed(2));
      //size = Math.floor(totalBytes / 1000);
    } else {
      measure = "MB";
      size = Number((totalBytes / 1000000).toFixed(2));
      //size = Math.floor(totalBytes / 1000000);
    }
    return `${size} ${measure}`
  }

  private getAmmountNest(_itemsGestor: ItemGestor[], _files: FileItem[], _numCopies: number) {
    let nests: string[] = this.appSvc.currentAppValue["cost-per-unit"]["nest"].split(",");
    let ruleIds: string[] = [];
    nests.map((x: string) => ruleIds.push(`${x}:${_itemsGestor.find((y: ItemGestor) => y["id"] == x)?.options?.find((x: ItemOptionGestor) => x.selected)!['id']}`))
    let cost: number = this.appSvc.currentAppValue["cost-per-unit"]["rules"].find((x: any) => x["id"] == ruleIds.join(','))!["value"];
    let ammount: number = 0;

    //calculate pages ammount
    let matchFinishedSelected: string = _itemsGestor.find((x: ItemGestor) => x["id"] == 'finished')?.options?.find((x: ItemOptionGestor) => x.selected)!['id'];
    _files.map((file: FileItem) => {
      ammount = ammount + (this.itemRef == "page" ? file.finalNumPages! : file.finalSheets!) * (matchFinishedSelected != 'stapled-creased' ? cost : cost / 2);
    });
    let matchFinished: ItemGestor = _itemsGestor.find((x: ItemGestor) => x["id"] == "finished")!;
    let grouping: string = _itemsGestor.find((x: ItemGestor) => x["id"] == "grouping")!.options?.find((x: ItemOptionGestor) => x.selected)!["id"];
    if (_files.length) {
      let finishedAmmount = this.getFinishedAmmountPerUnit(_itemsGestor, matchFinished, _files, (grouping == 'grouped' ? false : true));
      this.ammountFinished = (finishedAmmount * _numCopies);
    }
    return Number((ammount * _numCopies).toFixed(2))
  }

  private getFinishedAmmountPerUnit(_options: ItemGestor[], _option: ItemGestor, _files: FileItem[], _ungrouped: boolean): number {
    let ammount: number = 0;
    if (_option.options && _option.options!.length) {
      let optionSelected: ItemOptionGestor = _option.options?.find(x => x.selected)!;
      if (optionSelected) {
        optionSelected["id"] != "none"
          ? (
            optionSelected["id"] != "spiral"
              ? ammount = optionSelected.cost ? _ungrouped ? optionSelected.cost * _files.filter((x: FileItem) => x.finalNumPages)!.length : optionSelected.cost : 0
              : ammount = this.getFinishedSpiralPerUnit(_options, _files, _ungrouped)
          )
          : null;
      }
    }
    return ammount
  }

  private getFinishedSpiralPerUnit(_options: ItemGestor[], _files: FileItem[], _ungrouped: boolean) {
    let ammount: number = 0;
    let paperType = _options.find((x: ItemGestor) => x["id"] == "paper-type")!.options!.find((x: ItemOptionGestor) => x.selected)!["id"];
    let ruleIds: string[] = [];
    this.appSvc.currentAppValue["cost-per-spiral"]["rules"].map((x: any) => ruleIds.push(x["id"]));
    let numSheets: number = 0;
    _files.map((x: FileItem) => numSheets = numSheets + x.finalSheets!);
    let intervals: any = {};
    let cursor: any;
    ruleIds.map((x: any) => x.split(",").map((y: any, index: number) => {
      if (!index) {
        if (!intervals[y.split(":")[1]]) {
          intervals[y.split(":")[1]] = [];
          cursor = y.split(":")[1];
        }
      } else {
        intervals[cursor].push({ ini: Number(y.split(":")[1].split("-")[0]), end: Number(y.split(":")[1].split("-")[1]), value: this.appSvc.currentAppValue["cost-per-spiral"]["rules"].find((z: any) => z["id"] == x)!["value"] })
      }
    }));
    let finalCost: number = 0;
    if (!_ungrouped) {
      intervals[paperType].map((x: any) => {
        if (numSheets < x.ini) {
          return
        } else {
          ammount = x.value;
        }
      });
    } else {
      let ammounts: number[] = [];
      _files.map((x: FileItem, index: number) => {
        intervals[paperType].map((y: any) => {
          if (x.finalNumPages! < y.ini) {
            return
          } else {
            finalCost = y.value;
          }
        });
        ammounts.push(finalCost);
      });
      ammounts.map((x: number) => ammount = ammount + x);
    }
    return ammount
  }

  private getAmmount(_itemsGestor: ItemGestor[], _files: FileItem[], _numCopies: number) {

    let ammount: number = 0;

    //calculate pages ammount
    _itemsGestor.map((_itemGestorOption: ItemGestor) => {
      if (_itemGestorOption["active"]) {
        if (_itemGestorOption.options && _itemGestorOption.options!.length) {
          let optionSelected: ItemOptionGestor = _itemGestorOption.options?.find(x => x.selected && x['active'])!;
          if (optionSelected) {
            switch (optionSelected.perPage) {
              case undefined:
                break;
              case true:
                _files.map((file: FileItem) => {
                  let finalPages = 0;
                  file.finalThumbnails ? finalPages = file.finalThumbnails.length : null;
                  ammount = ammount + ((file.config ? Math.ceil(finalPages / file.config!.perPage) : finalPages) * optionSelected.cost!)
                });
                break;
              default:
                let filesNumber = 0;
                _files.map((file: FileItem) => file.finalThumbnails?.length ? filesNumber++ : null);
                ammount = ammount + filesNumber * optionSelected.cost!;
                break;
            }
          }

        }
      }
    });
    return Number((ammount * _numCopies).toFixed(2))
  }
  private getFinished(_option: ItemGestor) {
    let finished: boolean = false;
    if (_option.options && _option.options!.length) {
      let optionSelected: ItemOptionGestor = _option.options?.find(x => x.selected && x['active'])!;
      if (optionSelected) {
        optionSelected.type != "NONEFINISHED"
          ? finished = true
          : null;
      }
    }
    return Number(finished)
  }

}
