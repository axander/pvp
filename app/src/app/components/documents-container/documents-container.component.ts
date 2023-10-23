import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Group, Icon, ItemGestor, ItemOptionGestor } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';

interface MyWindow extends Window {
  myLib: any
}
declare var window: MyWindow;

@Component({
  selector: 'app-documents-container',
  templateUrl: './documents-container.component.html',
  styleUrls: ['./documents-container.component.scss']
})
export class DocumentsContainerComponent implements OnInit {
  //file reader
  input: any;
  //
  appLstnr: Subscription = new Subscription;
  main!: HTMLElement;
  body!: HTMLElement;
  styleMain!: CSSStyleDeclaration;
  styleBody!: CSSStyleDeclaration;
  styleFooter!: CSSStyleDeclaration;
  styleSocket!: CSSStyleDeclaration;
  groups$!: Group[];
  update!: number;
  documentsContainerDirection!: string;
  gestorHidden!: boolean;
  visibleIntroPB!: boolean;
  logo!: string;
  footer!: HTMLElement;
  socket!: HTMLElement;
  @Input("id") id?: number;
  filesData!: File[];
  fileData!: File;
  //dropping
  over!: boolean;

  content!: string;
  contentClear!: string;
  contentClassName!: string;
  contentClearClassName!: string;
  configIcon!:Icon;
  infoIcon!:Icon;
  closeIcon!:Icon;
  constructor(
    @Inject(DOCUMENT) document: Document,
    public appSvc: AppService
  ) {
    window.myLib = this;
    this.appSvc.currentAppValue.gestor.options.find((x: ItemGestor) => x.type == 'page')?.options!.map((x: ItemOptionGestor) => {
      x.selected
        ? (
          this.appSvc.setAnyParam('content', x.page!.content),
          this.appSvc.setAnyParam('contentClassName', x.page!.className),
          this.appSvc.setAnyParam('contentClear', x.close?.content),
          this.appSvc.setAnyParam('contentClearClassName', x.close?.className),
          this.appSvc.setAnyParam('contentOption', x)
        )
        : null;
    })
  }
  ngOnInit() {
    this.main = document.getElementById('main')!;
    this.body = document.body!;
    this.footer = document.getElementById('footer')!;
    this.socket = document.getElementById('socket')!;
    this.main ? (this.styleMain = this.main.style, this.setMainStyle()) : null;
    this.body ? (this.styleBody = this.body.style, this.setBodyStyle()) : null;
    this.footer ? (this.styleFooter = this.footer.style, this.setFooterStyle()) : null;
    this.socket ? (this.styleSocket = this.socket.style, this.setSocketStyle()) : null;
    this.appSvc.currentAppValue['logo'] ? this.logo = this.appSvc.currentAppValue['logo']!['content'] : null;
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      this.configIcon = data.icons?.find((x:Icon)=> x.id=="configPB-icon")!;
      this.infoIcon = data.icons?.find((x:Icon)=> x.id=="infoPB-icon")!;
      this.closeIcon = data.icons?.find((x:Icon)=> x.id=="closePB-icon")!;
      this.groups$ = data.groups;
      this.update = new Date().getTime();
      this.documentsContainerDirection = data['gestor_position']!;
      this.gestorHidden = data['gestor_hidden']!;
      this.visibleIntroPB = (data['intro'] && data['intro']['active']);
      this.content = data.content!;
      this.contentClear = data.contentClear!;
      this.contentClassName = data.contentClassName!;
      this.contentClearClassName = data.contentClearClassName!;
    });
  }
  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
  setMainStyle() {
    this.styleMain.position = "fixed";
    this.styleMain.zIndex = "99999999";
    this.styleMain.width = "100vw";
    this.styleMain.height = "100vh";
  }
  unsetMainStyle() {
    this.styleMain.position = "unset";
    this.styleMain.zIndex = "unset";
    this.styleMain.background = "unset";
    this.styleMain.width = "unset";
    this.styleMain.height = "unset";
  }
  setBodyStyle() {
    this.styleBody.overflow = "hidden";
  }
  unsetBodyStyle() {
    this.styleBody.overflow = "auto";
  }
  setFooterStyle() {
    this.styleFooter.display = "none";
  }
  unsetFooterStyle() {
    this.styleFooter.display = "block";
  }
  setSocketStyle() {
    this.styleSocket.display = "none";
  }
  unsetSocketStyle() {
    this.styleSocket.display = "block";
  }
  activeApp(e: Event) {
    this.appSvc.gestorActivate();
    this.main ? this.unsetMainStyle() : null;
    this.body ? this.unsetBodyStyle() : null;
    this.footer ? this.unsetFooterStyle() : null;
    this.input = document.getElementById('uploader_input');
    this.input.value = null;
    //reset groups
    this.appSvc.resetGroups();
  }
  toogleConfig(e: Event) {
    this.appSvc.toogleConfig();
  }
  activeIntro() {
    this.appSvc.toogleIntro();
  }
  //drag and drop
  public onZoneEvent(event: any) {
    event.data.over ? this.over = true : this.over = false;
    event.data.files && event.data.files.length
      ? (
        this.filesData = <File[]>event.data.files,
        this.fileData = <File>event.data.files[0],
        this.fileData.type.match(/application\/pdf\/*/) != null
          ? this.appSvc.setNewGroup(this.filesData)
          : false
      )
      : null;
  }
  readFileAsText(_files: File[]) {
    console.log("from uploader");
    [..._files].map((x: File, index: number) => {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        console.log("read file as text");
        console.log(fileReader.result);
      }
      fileReader.readAsText(x);
    });
  }

  toogleContent() {
    this.appSvc.currentAppValue.contentOption!.selected = false;
    this.appSvc.setAnyParam('content', null);
    this.appSvc.setAnyParam('contentClassName', null);
    this.appSvc.setAnyParam('contentClear', null);
    this.appSvc.setAnyParam('contentClearClassName', null);
  }

}
