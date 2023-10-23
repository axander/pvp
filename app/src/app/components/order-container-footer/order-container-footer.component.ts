import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ErrorGroupItem, FileItem, Group, ItemGestor, ItemOptionGestor, Order, OrderFile, OrderProperty, Orders, ThumbnailItem } from 'src/app/models/App.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AppService } from 'src/app/services/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-container-footer',
  templateUrl: './order-container-footer.component.html',
  styleUrls: ['./order-container-footer.component.scss']
})
export class OrderContainerFooterComponent implements OnInit {

  appLstnr!: Subscription;
  size: number = 0;
  measure!: string;
  upload: string = "0 Mb";
  pages: number = 0;
  sheets: number = 0;
  finished: string = "GENERIC.NONEFINISHED";
  finishedNumber: number = 0;
  ammount!: number;
  errors: ErrorGroupItem[] = [];
  itemRef!: string;
  orderPreview!: boolean;
  orderPreviewStyle!: string;
  orderResumeStyle!: string;
  constructor(
    public translateSvc: TranslateService,
    private appSvc: AppService,
    private apiSvc: ApiService
  ) {
    this.itemRef = this.appSvc.currentAppValue["item-ref"]["id"];
    this.appLstnr = appSvc.currentAppSubject.subscribe(result => {
      if (!result.configFocused) {
        this.errors = [];
        this.size = 0;
        this.pages = 0;
        this.sheets = 0;
        this.ammount = 0;
        this.finishedNumber = 0;
        this.orderPreviewStyle = result["ordering-preview"]!.style;
        this.orderResumeStyle = result["ordering-preview"]!["order-resume"].style;
        result.groups.map((group: Group) => {
          let numCopies: number = group.gestor.options?.find(x => x.type == 'counter')!.value;
          /*console.log(group.error);
          group.error ? this.errors = this.errors + group.error.length : null;*/
          group.ammount = this.getAmmountNest(group.gestor.options, group.files, numCopies);
          this.ammount = Number((this.ammount + this.getAmmountNest(group.gestor.options, group.files, numCopies)).toFixed(2));
          group.gestor.options.map((option: ItemGestor) => {
            //iterate options cancelled
            /*if (option['active']) {
              this.ammount = Number((this.ammount + this.getAmmount(option, group.files, numCopies)).toFixed(2));
            }*/
            //iterate options cancelled
            option.type == "FINISHED" && group.files.length ? this.finishedNumber = this.finishedNumber + this.getFinished(group, group.gestor.options, option, numCopies, group.ungrouped!, group.files) : null;
          });
          let numPages = 0;
          group.files.map((x: FileItem) => {
            let finalPages = 0;
            x.finalNumPages ? finalPages = x.finalNumPages! : null;
            numPages = numPages + finalPages;
          });
          //error rules check
          group.gestor.options.find(x => x['id'] == "finished")?.options?.find(y => y["id"] == "stapled")!.selected
            && this.appSvc.currentAppValue['rules'] && this.appSvc.currentAppValue['rules']['stapled']["value"]
            ? this.appSvc.currentAppValue['rules']['stapled']["value"] < numPages && !this.errors.find(x => x.id == 'stapled')
              ? this.errors.push({ id: 'stapled', html: this.appSvc.currentAppValue['rules']['stapled']["html"] })
              : this.errors = this.errors.filter(x => x.id != 'stapled')
            : null;
          group.gestor.options.find(x => x['id'] == "finished")?.options?.find(y => y["id"] == "stapled-creased")!.selected
            && this.appSvc.currentAppValue['rules'] && this.appSvc.currentAppValue['rules']['stapled-creased']["value"]
            ? this.appSvc.currentAppValue['rules']['stapled-creased']["value"] < numPages && !this.errors.find(x => x.id == 'stapled-creased')
              ? this.errors.push({ id: 'stapled-creased', html: this.appSvc.currentAppValue['rules']['stapled-creased']["html"] })
              : this.errors = this.errors.filter(x => x.id != 'stapled')
            : null;
          //error rules check
          group.files.map((file: FileItem) => {
            this.size = this.size + file.info.totalBytes;
            this.upload = this.getFinalWeight(this.size);
            let finalPages = 0;
            file.finalNumPages ? finalPages = file.finalNumPages : null;
            this.pages = this.pages + finalPages;
            this.sheets = this.sheets + file.finalSheets!;
          });

        })
      }
    });
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
    nests.map((x: string) => ruleIds.push(`${x}:${_itemsGestor.find((y: ItemGestor) => y["id"] == x)?.options?.find((x: ItemOptionGestor) => x.selected)!['id']}`));
    let cost: number = this.appSvc.currentAppValue["cost-per-unit"]["rules"].find((x: any) => x["id"] == ruleIds.join(','))!["value"];
    let ammount: number = 0;
    let matchFinishedSelected: string = _itemsGestor.find((x: ItemGestor) => x["id"] == 'finished')?.options?.find((x: ItemOptionGestor) => x.selected)!['id'];
    _files.map((file: FileItem) => {
      ammount = ammount + (this.itemRef == 'page' ? file.finalNumPages! : file.finalSheets!) * (matchFinishedSelected != 'stapled-creased' ? cost : cost / 2);
    });
    return Number((ammount * _numCopies).toFixed(2))
  }
  private getAmmountNestPerUnit(_itemsGestor: ItemGestor[], _files: FileItem[]) {
    let nests: string[] = this.appSvc.currentAppValue["cost-per-unit"]["nest"].split(",");
    let ruleIds: string[] = [];
    nests.map((x: string) => ruleIds.push(`${x}:${_itemsGestor.find((y: ItemGestor) => y["id"] == x)?.options?.find((x: ItemOptionGestor) => x.selected)!['id']}`));
    let cost: number = this.appSvc.currentAppValue["cost-per-unit"]["rules"].find((x: any) => x["id"] == ruleIds.join(','))!["value"];
    let ammounts: string[] = [];
    _files.map((file: FileItem, index: number) => {
      let matchFinishedSelected: string = _itemsGestor.find((x: ItemGestor) => x["id"] == 'finished')?.options?.find((x: ItemOptionGestor) => x.selected)!['id'];
      ammounts.push(`<div>Doc-${index + 1}:------------------${((this.itemRef == 'page' ? file.finalNumPages! : file.finalSheets!) * (matchFinishedSelected != 'stapled-creased' ? cost : cost / 2)).toFixed(2)}€</div>`);
    });
    return ammounts.join("")
  }
  private getAmmount(_itemGestor: ItemGestor, _files: FileItem[], _numCopies: number) {
    let ammount: number = 0;
    if (_itemGestor.options && _itemGestor.options!.length) {
      let optionSelected: ItemOptionGestor = _itemGestor.options?.find(x => x.selected && x['active'])!;
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
    return Number((ammount * _numCopies).toFixed(2))
  }
  private getFinished(_group: Group, _options: ItemGestor[], _option: ItemGestor, _numCopies: number, _ungrouped: boolean, _files: FileItem[]) {

    let finished: number = 0;
    let partialAmmount: number = 0;
    if (_option.options && _option.options!.length) {
      let optionSelected: ItemOptionGestor = _option.options?.find(x => x.selected)!;
      if (optionSelected) {
        optionSelected["id"] != "none"
          ? (
            finished = !_ungrouped ? 1 * _numCopies : _files.filter((x: FileItem) => x.finalNumPages)!.length * _numCopies,
            optionSelected["id"] != "spiral"
              ? (
                partialAmmount = optionSelected.cost ? _ungrouped ? _numCopies * optionSelected.cost * _files.filter((x: FileItem) => x.finalNumPages)!.length : _numCopies * optionSelected.cost : 0,
                //partialAmmount = (!_ungrouped ? (optionSelected.cost ? optionSelected.cost! : 0) : _numCopies * (optionSelected.cost ? _numCopies * optionSelected.cost! : 0) * _files.filter((x: FileItem) => x.finalNumPages)!.length),
                this.ammount = this.ammount + partialAmmount
              )
              : (
                partialAmmount = this.getFinishedSpiral(_options, _ungrouped, _files, _numCopies),
                this.ammount = this.ammount + this.getFinishedSpiral(_options, _ungrouped, _files, _numCopies)
              )
          )
          : null;
      }
      _group.ammount = _group.ammount! + partialAmmount;
    }
    return finished
  }
  private getFinishedAmmountPerUnit(_options: ItemGestor[], _option: ItemGestor, _files: FileItem[], _ungrouped: boolean): string {
    let ammount: string = "------------------0€";
    if (_option.options && _option.options!.length) {
      let optionSelected: ItemOptionGestor = _option.options?.find(x => x.selected)!;
      if (optionSelected) {
        optionSelected["id"] != "none"
          ? (
            optionSelected["id"] != "spiral"
              ? ammount = optionSelected.cost ? optionSelected.cost.toFixed(2).toString() : '------------------0€'
              : ammount = this.getFinishedSpiralPerUnit(_options, _files, _ungrouped)
          )
          : null;
      }
    }
    return ammount
  }

  private getFinishedSpiralPerUnit(_options: ItemGestor[], _files: FileItem[], _ungrouped: boolean) {
    let ammount: string = "------------------0€";
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
          ammount = `------------------${x.value.toFixed(2)}€`;
        }
      });
    } else {
      let ammounts: string[] = [];
      _files.map((x: FileItem, index: number) => {
        intervals[paperType].map((y: any) => {
          if (x.finalNumPages! < y.ini) {
            return
          } else {
            finalCost = y.value.toFixed(2);
          }
        });
        ammounts.push(`<div>Doc-${index + 1}:------------------${finalCost}€</div>`);
      });
      ammount = ammounts.join("");
    }
    return ammount
  }

  private getFinishedSpiral(_options: ItemGestor[], _ungrouped: boolean, _files: FileItem[], _numCopies: number) {
    let ammount = 0;
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
          ammount = x.value * _numCopies;
        }
      });
    } else {
      _files.map((x: FileItem) => {
        intervals[paperType].map((y: any) => {
          if (x.finalNumPages! < y.ini) {
            return
          } else {
            finalCost = y.value;
          }
        });
        ammount = ammount + (finalCost * _numCopies);
      });
    }
    return ammount
  }

  order() {
    this.appSvc.setOrdering("addToCart");
    let orders: Order[] = [];
    this.appSvc.currentAppValue.groups.map((x: Group, index: number) => {
      let order: Order = {
        title: `group ${index + 1}`,
        ammount: x.ammount!,
        properties: [],
        files: this.setOrderFiles(x.files)
      };
      x.gestor.options.map((y: ItemGestor) => {
        console.log(y);
        if (y['active']) {
          let itemOptionGestorSelected: ItemOptionGestor = y.options?.find((z: ItemOptionGestor) => z.selected)!;
          switch (y.type) {
            case "uploader":
              break;
            case "counter":
              order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: y.value })
              break;
            case "textarea":
              order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: y.value })
              break
            default:
              switch (y["id"]) {
                case "color":
                  let diffColor: boolean = false;
                  let diffBW: boolean = false;
                  x.files.map((x: FileItem) => {
                    itemOptionGestorSelected['id'] == 'color'
                      ? x.finalThumbnails?.filter((x: ThumbnailItem) => x.color).length != x.finalThumbnails?.length
                        ? diffColor = true
                        : null
                      : x.finalThumbnails?.filter((x: ThumbnailItem) => !x.color).length != x.finalThumbnails?.length
                        ? diffBW = true
                        : null
                  });
                  diffColor || diffBW
                    ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: `${itemOptionGestorSelected['id']}-${this.translateSvc.instant("GENERIC.ORDER.MANY." + (diffColor ? "B&W" : "COLOR"))}` })
                    : order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: itemOptionGestorSelected.rot["property-value"] ? itemOptionGestorSelected.rot["property-value"] : itemOptionGestorSelected['id'] })
                  break;
                case "slide_per_page":
                  let diffSlidesPerPage: boolean = false;
                  let slidesPerPage: number = 0;
                  x.files.map((x: FileItem) => {
                    itemOptionGestorSelected["value"] != x.config?.perPage! ? diffSlidesPerPage = true : null;
                  });
                  diffSlidesPerPage
                    ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: this.translateSvc.instant("GENERIC.ORDER.MANY.MANY") })
                    : order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: itemOptionGestorSelected["value"] })
                  break;
                default:
                  itemOptionGestorSelected && itemOptionGestorSelected['active'] ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: this.translateSvc.instant(itemOptionGestorSelected.rot["property-value"] ? itemOptionGestorSelected.rot["property-value"] : itemOptionGestorSelected.rot.text) }) : null;
                  break;
              }
              break;
          }
        }
      });
      let grouping: string = x.gestor.options.find((x: ItemGestor) => x["id"] == "grouping")!.options?.find((x: ItemOptionGestor) => x.selected)!["id"];
      order.properties.push({ title: this.translateSvc.instant('GENERIC.ORDER.FINISHED_NUMBER'), value: (grouping == 'grouped' ? 1 : x.files.length) });
      order.properties.push({ title: 'coste impresión por ud.', value: `${this.getAmmountNestPerUnit(x.gestor.options, x.files)}` });
      let matchFinished: ItemGestor = x.gestor.options.find((x: ItemGestor) => x["id"] == "finished")!;
      order.properties.push({ title: 'coste acabado por ud.', value: `${this.getFinishedAmmountPerUnit(x.gestor.options, matchFinished, x.files, (grouping == 'grouped' ? false : true))}` });
      orders.push(order);
    }
    );

    let ordersEntry: Orders = {
      id: this.appSvc.currentAppValue.addToCartId!,
      orders: orders
    };
    this.setOrderPreviewInnerHTML(ordersEntry, true);
    let form: FormData = new FormData();
    //let id: FormControl = new FormControl(ordersEntry.id.toString(), []);
    let id: FormControl = new FormControl(new Date().getTime(), []);
    let user_data: FormControl = new FormControl(ordersEntry.orders, []);
    let description: FormControl = new FormControl(this.orderPreviewInnerHTML, []);
    let formGroup: FormGroup = new FormGroup({
      id: id,
      data: user_data,
      description: description
    });
    form.append('id', formGroup.get('id')?.value);
    form.append("data", formGroup.get('user_data')?.value);
    form.append("description", formGroup.get('description')?.value);

    this.apiSvc.addToCart(formGroup.value);
  }

  setOrderPreview() {
    let orders: Order[] = [];
    this.appSvc.currentAppValue.groups.map((x: Group, index: number) => {
      let order: Order = {
        title: `group ${index + 1}`,
        ammount: x.ammount!,
        properties: [],
        files: this.setPreviewOrderFiles(x.files)
      };

      x.gestor.options.map((y: ItemGestor) => {
        console.log(y);
        if (y['active']) {
          let itemOptionGestorSelected: ItemOptionGestor = y.options?.find((z: ItemOptionGestor) => z.selected)!;
          switch (y.type) {
            case "uploader":
              break;
            case "counter":
              order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: y.value })
              break;
            case "textarea":
              order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: y.value })
              break
            default:
              switch (y["id"]) {
                case "color":
                  let diffColor: boolean = false;
                  let diffBW: boolean = false;
                  x.files.map((x: FileItem) => {
                    itemOptionGestorSelected['id'] == 'color'
                      ? x.finalThumbnails?.filter((x: ThumbnailItem) => x.color).length != x.finalThumbnails?.length
                        ? diffColor = true
                        : null
                      : x.finalThumbnails?.filter((x: ThumbnailItem) => !x.color).length != x.finalThumbnails?.length
                        ? diffBW = true
                        : null
                  });
                  diffColor || diffBW
                    ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: `${itemOptionGestorSelected['id']}-${this.translateSvc.instant("GENERIC.ORDER.MANY." + (diffColor ? "B&W" : "COLOR"))}` })
                    : order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: itemOptionGestorSelected.rot["property-value"] ? itemOptionGestorSelected.rot["property-value"] : itemOptionGestorSelected['id'] })
                  break;
                case "slide_per_page":
                  let diffSlidesPerPage: boolean = false;
                  let slidesPerPage: number = 0;
                  x.files.map((x: FileItem) => {
                    itemOptionGestorSelected["value"] != x.config?.perPage! ? diffSlidesPerPage = true : null;
                  });
                  diffSlidesPerPage
                    ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: this.translateSvc.instant("GENERIC.ORDER.MANY.MANY") })
                    : order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: itemOptionGestorSelected["value"] })
                  break;
                default:
                  itemOptionGestorSelected && itemOptionGestorSelected['active'] ? order.properties.push({ title: this.translateSvc.instant(y.rot["property-value"] ? y.rot["property-value"] : y.rot.text), value: this.translateSvc.instant(itemOptionGestorSelected.rot["property-value"] ? itemOptionGestorSelected.rot["property-value"] : itemOptionGestorSelected.rot.text) }) : null;
                  break;
              }
              break;
          }
        }
      });
      let grouping: string = x.gestor.options.find((x: ItemGestor) => x["id"] == "grouping")!.options?.find((x: ItemOptionGestor) => x.selected)!["id"];
      order.properties.push({ title: this.translateSvc.instant('GENERIC.ORDER.FINISHED_NUMBER'), value: (grouping == 'grouped' ? 1 : x.files.length) });
      order.properties.push({ title: 'coste impresión por ud.', value: `${this.getAmmountNestPerUnit(x.gestor.options, x.files)}` });
      let matchFinished: ItemGestor = x.gestor.options.find((x: ItemGestor) => x["id"] == "finished")!;
      order.properties.push({ title: 'coste acabado por ud.', value: `${this.getFinishedAmmountPerUnit(x.gestor.options, matchFinished, x.files, (grouping == 'grouped' ? false : true))}` });
      orders.push(order);
    }
    );
    let ordersEntry: Orders = {
      id: this.appSvc.currentAppValue.addToCartId!,
      orders: orders
    };
    console.log(ordersEntry);
    this.setOrderPreviewInnerHTML(ordersEntry, false);
  }

  orderPreviewInnerHTML: string = '';
  private setOrderPreviewInnerHTML(_ordersEntry: Orders, _uploaded: boolean) {
    let total: number = 0;
    this.orderPreviewInnerHTML = '';
    _ordersEntry.orders.map((x: Order) => {
      total = total + x.ammount;
      this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-1']!['style']!}">${x.title}</div>`;
      this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-3']!['style']!}">------------------${x.ammount.toFixed(2)}€</div>`;
      this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-4']!['style']!}">${this.translateSvc.instant('GENERIC.MAINFEATURES')}</div>`;
      x.properties.map((x: OrderProperty) =>
        this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-property-name']!['style']!}">${x.title}</div> <div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-property-value']!['style']!}">${x.value ? x.value : this.translateSvc.instant('GENERIC.ORDER.NONE')}</div>`
      )
      this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-2']!['style']!}">${this.translateSvc.instant('GENERIC.DOCS')}</div>`;
      x.files.map((x: OrderFile, index: number) => {
        !_uploaded
          ? this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-3']!['style']!}"><span>Doc-${index + 1}:</span>&nbsp;${x.name}</div>`
          : this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-doc']!['style']!}"><span>Doc-${index + 1}:</span>&nbsp;<a href="${x.url}" target="blank">${x.name}</a></div>`;
        this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-head-4']!['style']!}">${this.translateSvc.instant('GENERIC.SUBFEATURES')}</div>`;
        x.properties.map((y: { [key: string]: any; }) => {
          (y['name'] != 'double-face-reverse-direction-changed'
            && y['name'] != 'rotation'
            && y['name'] != 'slides per page')
            ? this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-property-name']!['style']!}">${this.translateSvc.instant('GENERIC.ORDER.' + y['name'].toUpperCase())}</div> <div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-property-value']!['style']!}">${y['value']}</div>`
            : null;
        })
      });
      this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-wrap']!['style']}"></div>`
    })
    this.orderPreviewInnerHTML = this.orderPreviewInnerHTML + `<div style="${this.appSvc.currentAppValue['custom-style-classes']!['order-preview-total']!['style']!}">TOTAL------------------${total.toFixed(2)}€</div>`;

  }

  files: FileItem[] = [];
  showOrderPreview() {
    this.orderPreview = !this.orderPreview;
    this.setOrderPreview();
  }
  uploadFiles() {
    this.showOrderPreview();
    this.appSvc.setPercentage(0);
    this.files = [];
    this.appSvc.currentAppValue.groups.map((x: Group, index: number) => {
      x.files.map((y: FileItem) => {
        this.files.push(y);
      })
    });
    this.checkAllUploaded();
  }
  uploadFile(_fileItem: FileItem) {
    this.appSvc.setOrdering("files");
    let form: FormData = new FormData();
    form.append('digicopy_file_upload[]', _fileItem.file);

    this.apiSvc.uploadFile(form).then(result => {
      _fileItem.uploaded = true;
      let data = JSON.parse(result[0])[0];
      console.log(data);
      data.response == "SUCCESS"
        ? (_fileItem.upload_result = data, _fileItem.upload_status = true, this.appSvc.setPercentage(100 * this.files.filter(x => x.upload_status).length / this.files.length))
        : false;
      this.checkAllUploaded();
    });
  }
  checkAllUploaded() {
    let nextItemFile = this.files.find((X: FileItem) => !X.uploaded);
    nextItemFile
      ? this.uploadFile(nextItemFile)
      : this.checkAllUploadedSuccess();
  }
  checkAllUploadedSuccess() {
    console.log(this.appSvc.currentAppValue);
    let NOKItemFile = this.files.find((X: FileItem) => !X.upload_status);
    NOKItemFile
      ? console.log("NOK files")
      : this.order();
  }

  private setOrderFiles(_files: FileItem[]): OrderFile[] {
    let orderFiles: OrderFile[] = [];
    _files.map((a: FileItem) => {
      //write each file propertied
      let newFileOrderData: OrderFile = { url: a.upload_result['url'], name: a.name, properties: [], cost: 0 };
      orderFiles.push(this.setEachFileProperties(newFileOrderData, a))
    });
    console.log(orderFiles);
    return orderFiles
  }
  private setPreviewOrderFiles(_files: FileItem[]): OrderFile[] {
    let orderFiles: OrderFile[] = [];
    _files.map((a: FileItem) => {
      //write each file propertied
      let newFileOrderData: OrderFile = { url: a.name, name: a.name, properties: [], cost: 0 };
      orderFiles.push(this.setEachFileProperties(newFileOrderData, a))
    });
    console.log(orderFiles);
    return orderFiles
  }
  private setEachFileProperties(_orderFile: OrderFile, _file: FileItem): OrderFile {
    console.log(_file.config);
    //double face direction reverse page
    _orderFile.properties.push({ name: 'double-face-reverse-direction-changed', value: _file.config?.doubleFaceDirection ? _file.config?.doubleFaceDirection ? '❰&nbsp;❱' : '❱&nbsp;❱' : '❱&nbsp;❱' });
    //rotation*
    _orderFile.properties.push({ name: 'rotation', value: _file.config?.rotation });
    //slides per page*
    _orderFile.properties.push({ name: 'slides per page', value: _file.config?.perPage });
    let deleted: number[] = [];
    let colored: number[] = [];
    let noColored: number[] = [];
    //deleted pages
    _file.thumbnails?.map((x: ThumbnailItem, index: number) => {
      x.deleted ? deleted.push(index + 1) : null;
    })
    //color pages
    _file.thumbnails?.map((x: ThumbnailItem, index: number) => {
      x.color && !x.deleted ? colored.push(index + 1) : noColored.push(index + 1)
    })
    _orderFile.properties.push({ name: 'deleted', value: deleted.length ? deleted.join(',') : this.translateSvc.instant('GENERIC.ORDER.NONE') });
    colored.length < noColored.length
      ? _orderFile.properties.push({ name: 'colored', value: colored.length ? colored.length == _file.finalThumbnails!.length ? this.translateSvc.instant('GENERIC.ORDER.EVERY') : colored.join(',') : this.translateSvc.instant('GENERIC.ORDER.NONE') })
      : _orderFile.properties.push({ name: 'noColored', value: noColored.length ? noColored.length == _file.finalThumbnails!.length ? this.translateSvc.instant('GENERIC.ORDER.EVERY') : noColored.join(',') : this.translateSvc.instant('GENERIC.ORDER.NONE') });

    return _orderFile
  }

  private getGroupAmmount(_id: number) {
    let copies: number = 0;
    let ammount: number = 0;
    let matchGroup: Group = this.appSvc.currentAppValue.groups.find((x: Group) => x.id == _id)!;
    if (matchGroup) {
      let files: FileItem[] = matchGroup.files;
      copies = matchGroup.gestor.options.find(x => x.type == "counter")?.value;
      matchGroup.gestor.options.map((_itemGestorOption: ItemGestor) => {
        if (_itemGestorOption.options?.length) {
          let optionSelected: ItemOptionGestor = _itemGestorOption.options?.find(x => x.selected && x['active'])!;
          if (optionSelected) {
            switch (optionSelected.perPage) {
              case undefined:
                break;
              case true:
                files.map((file: FileItem) => ammount = ammount + (file.numPages! * optionSelected.cost!));
                break;
              default:
                ammount = ammount + files.length * optionSelected.cost!;
                break;
            }
          }
        }
      });
    }
    return Number((ammount * copies).toFixed(2))
  }

}
