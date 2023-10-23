import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { App, AppConfig, FileItem, Gestor, Group, ItemGestor, ItemOptionGestor, OrderingExtraItem } from '../models/App.model';
import { VersionService } from './version.service';



@Injectable({
  providedIn: 'root',
})

export class AppService {

  f = new Date();
  //new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  // date: this.f.getDate() + "-" + this.f.getMonth() + "-" + this.f.getFullYear() + " " +this.f.getHours()+ ":" +this.f.getMinutes()+ ":" +this.f.getSeconds(),



  app: App = {
    id: new Date().getTime(),
    active: this.VersionSvc.getActive(),
    visible_responsive: this.VersionSvc.getVisibleResponsive(),
    addToCartId: this.VersionSvc.getAddToCartID(),
    ordering_extra: this.VersionSvc.getOrderingExtra(),
    date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    gestor: Object.assign({}, this.VersionSvc.getGestor()),
    groups: []
  }

  public currentAppSubject: BehaviorSubject<App> = new BehaviorSubject(this.app);
  constructor(private VersionSvc: VersionService) {
   
  }
  public get currentAppValue(): App {
    return this.currentAppSubject.value;
  }

  public setAppConfig(_config: any) {
    Object.keys(_config).map(key => this.currentAppSubject.value[key] = _config[key]);
    this.currentAppSubject.next(this.currentAppValue);
  }
  public setGestorConfig(_id: string, _config: Gestor) {
    let actualGroup: Group = this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!;
    !this.currentAppValue.configFocused && actualGroup
      ? actualGroup.gestor = JSON.parse(JSON.stringify(this.currentAppValue.gestor))
      : null;
    !this.currentAppValue.coreGestorPersistance
      ? this.currentAppValue.coreGestorPersistance = JSON.parse(JSON.stringify(this.currentAppValue.gestor))
      : null;
    this.currentAppValue.configFocused = _id;
    this.currentAppValue.gestor = _config;
    console.log(_config);
    this.currentAppSubject.next(this.currentAppValue);
  }
  public setCoreConfig() {

    let config: AppConfig = this.currentAppValue.configs!.find((x: AppConfig) => x['id'] == this.currentAppValue.configFocused)!;
    config.gestor = JSON.parse(JSON.stringify(this.currentAppValue.gestor));
    this.currentAppValue.gestor = JSON.parse(JSON.stringify(this.currentAppValue.coreGestorPersistance));
    this.currentAppValue.configFocused = null;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public setAnyParam(_param: string, _value: any) {
    this.currentAppValue[_param] = _value;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public gestorActivate() {
    this.currentAppSubject.value.active = !this.currentAppSubject.value.active;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public toogleConfig() {
    this.currentAppSubject.value.visible_responsive = !this.currentAppSubject.value.visible_responsive;
    this.currentAppSubject.next(this.currentAppValue);
  }

  public update() {
    //get actual group focused
    let actualGroup: Group = this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!;
    actualGroup
      ? (
        actualGroup.gestor = JSON.parse(JSON.stringify(this.currentAppSubject.value.gestor)),
        this.currentAppSubject.next(this.currentAppValue)
      )
      : null;
  }
  public toogleIntro() {
    this.currentAppValue['intro']['visible'] = !this.currentAppValue['intro']['visible'];
    this.currentAppSubject.next(this.currentAppValue);
  }
  public selectedOption(_item: ItemOptionGestor) {
    console.log(_item);
    (_item['related'] && _item['related']['id'] && _item['related']['options'])
      ? (
        this.currentAppSubject.value.gestor.options.find((x: ItemGestor) => x["id"] == _item['related']['id'])!.options!.map(
          (y: ItemOptionGestor) => _item['related']["options"].find((z: { [x: string]: any; }) => z["id"] == y["id"]) ? y["active"] = true : y["active"] = false
        ),
        this.currentAppSubject.value.gestor.options.find((x: ItemGestor) => x["id"] == _item['related']['id'])!.options!.filter(
          (y: ItemOptionGestor) => y["active"]
        ).map((z: ItemOptionGestor, index) => index ? z.selected = false : z.selected = true)
      )
      : (_item['related'] && _item['related']['id'] && !_item['related']['options'])
        ? (
          this.currentAppSubject.value.gestor.options.find((x: ItemGestor) => x["id"] == _item['related']['id'])!.options!.map(
            (y: ItemOptionGestor) => y["active"] = true
          ),
          this.currentAppSubject.value.gestor.options.find((x: ItemGestor) => x["id"] == _item['related']['id'])!.options!.filter(
            (y: ItemOptionGestor) => y["active"]
          ).map((z: ItemOptionGestor, index) => index ? z.selected = false : z.selected = true)
        )
        : null
    //get actual group focused
    let actualGroup: Group = this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!;
    actualGroup
      ? (
        actualGroup.gestor = JSON.parse(JSON.stringify(this.currentAppSubject.value.gestor)),
        this.currentAppSubject.next(this.currentAppValue)
      )
      : null;
  }
  public setOrderingDisclaimersDiscount(_collection: any) {
    this.currentAppValue['ordering_disclaimers_aleatory_discount'] = _collection;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public setOrdering(_step: string) {
    //set alleatory disclaimers
    this.currentAppValue['ordering_disclaimers_aleatory']
      && this.currentAppValue['ordering_disclaimers_aleatory']['collection']
      &&
      (!this.currentAppValue['ordering_disclaimers_aleatory_discount']
        ||
        (this.currentAppValue['ordering_disclaimers_aleatory_discount']!
          && !this.currentAppValue['ordering_disclaimers_aleatory_discount']!.length
        )
      )
      ? this.currentAppValue['ordering_disclaimers_aleatory_discount'] = JSON.parse(JSON.stringify(this.currentAppValue['ordering_disclaimers_aleatory']!['collection']!))
      : null;
    if (this.currentAppValue['ordering_disclaimers_aleatory_discount']) {
      let random = Math.floor(Math.random() * this.currentAppValue['ordering_disclaimers_aleatory_discount']!.length);
      let code: string = "";
      code = JSON.stringify(this.currentAppValue['ordering_disclaimers_aleatory_discount']![random].code);
      this.currentAppValue['ordering_disclaimers_aleatory_discount']!.splice(random, 1);
      this.currentAppValue['ordering_disclaimers_aleatory_extra'] = code;
    }


    this.currentAppValue.ordering_extra?.collection?.map((x: OrderingExtraItem) => {
      x.id == _step
        ? x.selected = true
        : x.selected = false
    })
    switch (_step) {
      case "files":
        this.currentAppValue.ordering_action = "GENERIC.ORDERING.ACTION";
        this.currentAppValue.ordering_message = "GENERIC.ORDERING.UPLOADING";

        break;
      case "addToCart":
        this.currentAppValue.ordering_action = "GENERIC.ORDERING.ACTION";
        this.currentAppValue.ordering_message = "GENERIC.ORDERING.ADDCART";
        break;
      case "redirecting":
        this.currentAppValue.ordering_action = "GENERIC.ORDERING.ACTION";
        this.currentAppValue.ordering_message = "GENERIC.ORDERING.REDIRECTING";
        break;
    }
    this.currentAppValue.ordering = true;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public setPercentage(_percentage: number) {
    this.currentAppValue.ordering_percentage = _percentage;
    this.currentAppSubject.next(this.currentAppValue);
  }
  public unsetOrdering() {
    this.currentAppValue.ordering = false;
    this.currentAppSubject.next(this.currentAppValue);
  }

  public setNewGroup(_files: File[]) {
    //save gestor focused in actual group
    //get actual group focused
    let actualGroup: Group = this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!;
    //i exists set its gestor with the focused gestor
    actualGroup ? actualGroup.gestor = JSON.parse(JSON.stringify(this.currentAppSubject.value.gestor)) : null;
    //unselected all groups
    this.currentAppSubject.value.groups.forEach(x => x.selected = false);
    //generate new group
    //set id with actual milliseconds date
    this.currentAppSubject.value.gestorFocusedId = new Date().getTime();
    //generate a new empty gestor
    let newGestor: Gestor = JSON.parse(JSON.stringify(this.VersionSvc.getGestor()));
    //push a ne group with the files uploaded
    let filesArray: FileItem[] = [];
    const mapRequest = () => Promise.all(
      [..._files].map((x, index) =>
        this.numPages(x).then((result: any) => filesArray.push({ file: x, id: new Date().getTime(), index: index + 1, selected: !index ? true : false, name: x.name, info: this.getFileInfo(x), numPages: result[0] }))
      )
    );
    mapRequest().then(result => {
      filesArray.sort((a, b) => a.index > b.index ? 1 : -1);
      this.currentAppSubject.value.groups.push({
        id: this.currentAppSubject.value.gestorFocusedId!,
        index: this.currentAppSubject.value.groups.length + 1,
        selected: true,
        gestor: newGestor,
        files: filesArray
      });
      //set the focused gestor with the emptye gestor
      this.currentAppSubject.value.gestor = newGestor;
      //update the observable
      this.currentAppSubject.next(this.currentAppValue);
      console.log(this.currentAppSubject.value);
    })

  }
  public addDocs(_id: number, _files: File[]) {
    this.currentAppValue.gestorFocusedId != _id
      ? this.selectGroup(_id)
      : null;
    let actualGroup: Group = this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!;
    actualGroup.files.map(x => x.selected = false);
    let filesArray: FileItem[] = [];
    //_files = [..._files].filter(x => !actualGroup.files.filter(y => x.name != y.name));

    let files: File[] = [];
    [..._files].map(x => { !actualGroup.files.find(y => x.name == y.name) ? files.push(x) : null })
    const mapRequest = () => Promise.all(
      [...files].map((x, index) => this.numPages(x).then((result: any,) => filesArray.push({ file: x, selected: !index ? true : false, id: new Date().getTime(), index: !actualGroup.files.find(y => y.name == x.name) ? actualGroup.files.length + index + 1 : actualGroup.files.find(y => y.name == x.name)!.index, name: x.name, info: this.getFileInfo(x), numPages: result[0] })))
    );
    mapRequest().then(result => {
      filesArray.sort((a, b) => a.index > b.index ? 1 : -1);
      actualGroup.files = [...new Map([...actualGroup.files, ...filesArray].map((item) => [item["name"], item])).values()];
      this.currentAppSubject.next(this.currentAppValue);
    })
  }
  private async numPages(_file: File): Promise<any> {

    let readerPromise = new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsBinaryString(_file);
      reader.onloadend = () => {
        let numPagesColl = reader.result!.toString().match(/\/Type[\s]*\/Page[^s]/g)!;
        !numPagesColl
          ? resolve(1)
          : resolve(numPagesColl.length);
        //resolve(reader.result!.toString().match(/\/Type[\s]*\/Page[^s]/g)!.length)
      };
    });
    return Promise.all([readerPromise.catch(err => {
      throw err
    })]).then(([readerPromise]) => {
      !readerPromise ? readerPromise = new Promise((resolve, reject) => { })
        : null;
      return Promise.all([readerPromise])
    }, err => {
    });

  }
  private getFileInfo(_file: File) {
    let totalBytes: number = _file.size;
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
    return { name: _file.name, size: size, measure: measure, totalBytes: totalBytes }
  }
  public resetGroups() {
    this.currentAppSubject.value.groups = [];
    this.currentAppSubject.next(this.currentAppValue);
  }
  public selectGroup(_id: number) {
    this.currentAppSubject.value.groups.find(x => x.id == this.currentAppSubject.value.gestorFocusedId)!.gestor = Object.assign({}, this.currentAppSubject.value.gestor);
    this.currentAppSubject.value.groups.forEach(x => {
      x.id == _id
        ? (
          x.selected = true,
          this.currentAppSubject.value.gestorFocusedId = x.id,
          this.currentAppSubject.value.gestor = x.gestor
        )
        : x.selected = false
    });
    this.currentAppSubject.next(this.currentAppValue);
  }
  public deleteGroup(_id: number) {
    if (_id == this.currentAppValue.gestorFocusedId) {
      this.currentAppValue.groups = this.currentAppValue.groups.filter(x => x.id != _id);
      let firstGroup = this.currentAppValue.groups[0];
      if (firstGroup) {
        this.currentAppValue.gestorFocusedId = firstGroup.id;
        this.currentAppValue.gestor = JSON.parse(JSON.stringify(firstGroup.gestor));
        firstGroup.selected = true;
      } else {
        this.currentAppValue.gestorFocusedId = undefined;
        this.currentAppValue.gestor = JSON.parse(JSON.stringify(this.VersionSvc.getGestor()));
      }
    } else {
      this.currentAppValue.groups = this.currentAppValue.groups.filter(x => x.id != _id);
    }

    this.currentAppSubject.next(this.currentAppValue);
  }
}