import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PDFDocumentProxy, PDFPageProxy, PdfViewerComponent } from 'ng2-pdf-viewer';
import { ReplaySubject, Subscription } from 'rxjs';
import { FileItem, FileItemConfig, Group, ItemGestor, ItemOptionGestor, ThumbnailItem } from 'src/app/models/App.model';
import { AppService } from 'src/app/services/app.service';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-documents-group',
  templateUrl: './documents-group.component.html',
  styleUrls: ['./documents-group.component.scss']
})
export class DocumentsGroupComponent implements OnInit {


  //@ViewChild('divToScroll') divToScroll!: ElementRef;
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent!: PdfViewerComponent;


  readonly update$ = new ReplaySubject<number>(1);
  @Input("update") set update(value: number) {
    this.update$!.next(value);
  }
  @Input("index") index!: number;

  @Input("group") group$!: Group;

  @Input("id") id?: number;
  filesData!: File[];
  fileData!: File;
  //dropping
  over!: boolean;

  rendering!: boolean;

  private draggableElements = 1;
  private zonePrefix = 'zone-';
  public droppableObjects: Array<any> = [];
  public draggableObjects: Array<Array<any>> = [];



  pdfSrc!: string | Uint8Array;
  page: number = 1;
  pages: number = 0;

  positions$!: { id: number, order: number }[];

  focusedFileId!: number;
  focusedFile!: FileItem;
  oblong!: boolean;
  orientation!: string;
  mainGrouped: string = "grouped";
  mainFaces!: string;
  mainColor!: string;
  mainPerPage: string = "1_per_page";
  mainFinished: string = "";
  mainTurnPage: string = "";
  mainRotation: string = "0";
  mainDoubleDirection: boolean = false;
  mainOrientation!: string;
  appLstnr: Subscription = new Subscription();
  slidesPerPage: number = 1;
  finished!: string;
  finishedOrientation!: boolean;

  constructor(
    public permissionSvc: PermissionsService,
    private appSvc: AppService
  ) {
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      if (!data.configFocused) {
        //check stapled-creased
        if (data.configFocused) {
          return
        }
        let matchItem: ItemOptionGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "finished")?.options?.find((y: ItemOptionGestor) => y.selected)!;
        if (matchItem && this.mainFinished != matchItem["id"]) {
          this.mainFinished = matchItem["id"];
          if (matchItem["id"] == 'stapled-creased') {
            this.setStapledCreased();
            return
          } else {
            if (matchItem["id"] == 'stapled') {
              this.setStapled();
            } else {
              this.setSheets();
            }

          }

        }
        //check stapled-creased
        /*let actualSlidePerPage = this.appSvc.currentAppValue.gestor.options.find((x: ItemGestor) => x['id'] == 'slide_per_page')!.options?.find((x: ItemOptionGestor) => x.selected)!['value'];
        if (actualSlidePerPage != this.slidesPerPage) {
          this.slidesPerPage = actualSlidePerPage;
          if (this.group$) {
            this.page = 1;
            this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
            this.updateApp();
          };
        };*/
        let matchPerPageSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "slide_per_page")?.options?.find((y: ItemOptionGestor) => y.selected);
        if (matchPerPageSelected) {
          if (this.mainPerPage != matchPerPageSelected["id"]) {
            this.mainPerPage = matchPerPageSelected["id"];
            this.group$.files.map((x: FileItem) => {
              if (x.config) {
                x.config.perPage = matchPerPageSelected!["value"];
              }
            });
            let matchDoubleFaceSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
            this.group$.files.map((x: FileItem) => {
              x.finalNumPages = this.pages = Math.ceil(x?.finalThumbnails?.length! / x.config!.perPage);
              matchDoubleFaceSelected!["id"] == "two_faces" ? x.finalSheets = Math.ceil(x.finalNumPages! / 2) : x.finalSheets = x.finalNumPages;
            });
            this.updateApp();
            //this.setAllFilesNumPagesSheets();
          }
        }
        let matchGroupSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "grouping")?.options?.find((y: ItemOptionGestor) => y.selected);
        if (matchGroupSelected) {
          matchGroupSelected["id"] == 'grouped' ? this.group$.ungrouped = false : this.group$.ungrouped = true;
          if (this.mainGrouped != matchGroupSelected["id"]) {
            this.mainGrouped = matchGroupSelected["id"];
            matchGroupSelected!["id"] == "grouped" ? this.group$.ungrouped = false : this.group$.ungrouped = true;
            this.updateApp();
          }
        }
        let matchRotateSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "rotate")?.options?.find((y: ItemOptionGestor) => y.selected);
        if (matchRotateSelected) {
          this.mainFaces == "two_faces"
            ? this.mainRotation != matchRotateSelected!["id"]
              ? (
                this.mainRotation = matchRotateSelected!["id"],
                matchRotateSelected!["id"] == "90"
                  ? (
                    this.config.rotation = -90,
                    this.group$.files.map((x: FileItem) => {
                      x.config!.rotation = -90;
                      x.config!.doubleFaceDirection = true;
                      this.mainDoubleDirection = true;
                    }),
                    this.unsetStapledCreased()
                  )
                  : (
                    this.config.rotation = 0,
                    this.group$.files.map((x: FileItem) => {
                      x.config!.rotation = 0;
                      x.config!.doubleFaceDirection = false;
                      this.mainDoubleDirection = false;
                    })
                  ),
                this.updateApp()
              )
              : null
            : this.mainRotation != matchRotateSelected!["id"]
              ? (
                this.mainRotation = matchRotateSelected!["id"],
                this.config.rotation = 0,
                this.group$.files.map((x: FileItem) => {
                  x.config!.rotation = 0;
                  x.config!.doubleFaceDirection = false;
                }),
                this.updateApp()
              )
              : null;
        }
        let matchDoubleFaceSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
        if (matchDoubleFaceSelected) {
          if (this.mainFaces != matchDoubleFaceSelected["id"]) {
            this.mainFaces = matchDoubleFaceSelected["id"];
            this.group$.files.map((x: FileItem) => {
              matchDoubleFaceSelected!["id"] == "two_faces"
                ? (
                  x.finalSheets = Math.ceil(x.finalNumPages! / 2),
                  x.config!.doubleFace = true
                )
                : (
                  this.unsetStapledCreased(),
                  x.finalSheets = x.finalNumPages,
                  x.config!.doubleFace = false,
                  this.config.rotation = 0,
                  x.config!.rotation = 0,
                  x.config!.doubleFaceDirection = false,
                  this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "rotate")?.options?.map((y: ItemOptionGestor) => y['id'] == "0" ? y['selected'] = true : y['selected'] = false)
                )
            });
            this.updateApp();
          }
        }
        let matchOrientationSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "orientation")?.options?.find((y: ItemOptionGestor) => y.selected);
        if (matchOrientationSelected) {
          if (this.mainOrientation != matchOrientationSelected["id"]) {
            this.mainOrientation = matchOrientationSelected["id"];
            this.group$.files.map((x: FileItem) => {
              matchOrientationSelected!["id"] == "oblong" || matchOrientationSelected!["id"] == "authomatic"
                ? this.unsetStapledCreased()
                : null
            });

          }
        }
      }
    });
    this.update$.subscribe((update: number) => {
      this.scrollDiv();
      this.setFocused();
      //check if vertical or oblong
      let matchSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "orientation")?.options?.find((y: ItemOptionGestor) => y.selected);
      if (matchSelected) {
        if (matchSelected["id"] == "authomatic") {
          if (this.orientation != matchSelected["id"]) {
            this.group$.files[0].authomatic == 'oblong'
              ? (this.orientation = 'oblong', this.oblong = true)
              : (this.orientation = 'vertical', this.oblong = false);
            //this.config.doubleFace = false;
          }
        } else {
          if (this.orientation != matchSelected["id"]) {
            this.orientation = matchSelected["id"];
            //this.config.doubleFace = false;
          }
          matchSelected["id"] == "oblong"
            ? this.oblong = true
            : this.oblong = false;
        }

      }
      let matchDoubleFaceSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
      if (matchDoubleFaceSelected) {
        if (this.mainFaces != matchDoubleFaceSelected["id"]) {
          this.mainFaces = matchDoubleFaceSelected["id"];
          this.group$.files.map((x: FileItem) => {
            if (x.config) {
              this.mainFaces == 'two_faces' ? x.config.doubleFace = true : x.config.doubleFace = false;
            }
          });
        }
        /*if( matchDoubleFaceSelected["id"] == 'two_faces'){
          this.group$.files.map((x: FileItem) => {
            if (x.config) {
              x.finalSheets = Math.ceil(x.finalNumPages! / 2);
            }
          });
        }*/
      }
      let matchColorSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "color")?.options?.find((y: ItemOptionGestor) => y.selected);
      if (matchColorSelected) {
        if (this.mainColor != matchColorSelected["id"]) {
          this.mainColor = matchColorSelected["id"];
          this.group$.id == this.appSvc.currentAppValue.gestorFocusedId ? this.group$.files.map((x: FileItem) => {
            if (x.config) {
              this.mainColor == 'color'
                ? (x.thumbnails?.map((y: ThumbnailItem) => y.color = true), x.finalThumbnails = x.thumbnails?.filter((x: ThumbnailItem) => !x.deleted))
                : (x.thumbnails?.map((y: ThumbnailItem) => y.color = false), x.finalThumbnails = x.thumbnails?.filter((x: ThumbnailItem) => !x.deleted))
            }
          })
            : null;
        }
      }
      /*let matchGroupSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "grouping")?.options?.find((y: ItemOptionGestor) => y.selected);
      if (matchGroupSelected) {
        matchGroupSelected["id"] == 'grouped' ? this.group$.ungrouped = false : this.group$.ungrouped = true;
      }*/
      let matchPerPageSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "slide_per_page")?.options?.find((y: ItemOptionGestor) => y.selected);
      if (matchPerPageSelected) {
        if (this.mainPerPage != matchPerPageSelected["id"]) {
          this.mainPerPage = matchPerPageSelected["id"];
          this.group$.files.map((x: FileItem) => {
            if (x.config) {
              x.config.perPage = matchPerPageSelected!["value"];
            }
          });
          this.setAllFilesNumPagesSheets();
        }
      }
      this.droppableObjects = [];
      this.draggableObjects = [];
      !this.positions$ ? this.positions$ = [] : null;
      this.group$.files.map((file: FileItem, index: number) => {
        file.selected && file.id != this.focusedFileId
          ? (this.pdfSrc = '', this.focusedFile = file, this.focusedFileId = file.id, this.onFile({ file: file, action: file.finalThumbnails ? 'select' : 'new' }))
          : null
        let matchFile: { id: number, order: number } = this.positions$.find(x => x.id == file.id)!;
        matchFile ? matchFile.order = file.index : this.positions$.push({ id: file.id, order: file.index });
        this.droppableObjects.push({
          data: {
            column: index
          },
          zone: this.zonePrefix + index
        });
        // Define the draggable objects relative to their position
        !this.draggableObjects[index] ? this.draggableObjects[index] = [] : null;
        this.draggableObjects[index].push({
          data: {
            id: index,
            payload: file,
            name: 'Draggable - ' + index,
            currentColumn: index,
          },
          zones: this.generateZones(index)
        });
      });
      console.log(this.droppableObjects);
      console.log(this.draggableObjects);
      this.setDisables();
      this.resizeInitialWidthImage();
      this.setFinished();
    });

  }

  ngOnInit() {
    this.page = 1;
    //this.pages = this.group$.files[0].numPages!;
    this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile?.finalThumbnails?.length! / this.config.perPage);
    //this.pages = Math.ceil(this.group$.files[0].numPages! / this.config.perPage);
    this.preview(this.group$.files[0].file);
  }

  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
  selectGroup(e: Event) {
    this.appSvc.selectGroup(this.group$.id);
  }
  deleteGroup(e: Event) {
    this.appSvc.deleteGroup(this.group$.id);
  }

  addDoc(e: Event) {
    //this.AppSvc.deleteGroup(this.group$.id);
  }

  changeListView() {
    this.group$.listView = !this.group$.listView;
    this.appSvc.update();
  }

  private generateZones(zone: number): Array<string> {
    // Generate all available zones
    const zones: Array<string> = [];
    for (let i = 0; i < this.draggableElements; i++) {
      zones.push(this.zonePrefix + i);
    }
    // Remove the current zone
    zones.splice(zone, 1);
    return zones;
  }

  moving_column: number = 0;
  overlap_column: number = 0;
  public onItemDragStart(event: any) {
    this.moving_column = event.data.currentColumn;
  }
  public onZoneOver(event: any) {
    console.log(event);
    this.overlap_column = event.zone.column;
    if (this.overlap_column != this.moving_column) {
      let moved_id = JSON.parse(JSON.stringify(this.draggableObjects[this.moving_column][0].data.payload.id))
      let moved_file = this.group$.files.find((x: FileItem) => x.id == moved_id);
      moved_file!.index = this.overlap_column + 1;
      //moved_file!.selected = true;
      let overlap_id = JSON.parse(JSON.stringify(this.draggableObjects[this.overlap_column][0].data.payload.id))
      let overlap_file = this.group$.files.find((x: FileItem) => x.id == overlap_id);
      overlap_file!.index = this.moving_column + 1;
      //overlap_file!.selected = false;
      //this.appSvc.update();
      this.draggableObjects[this.moving_column].pop();
      this.draggableObjects[this.overlap_column].pop();

      this.draggableObjects[this.moving_column].push({
        data: {
          id: overlap_file!.id,
          payload: overlap_file!,
          name: overlap_file!.name,
          currentColumn: this.moving_column
        },
        zones: this.generateZones(this.moving_column)
      });

      this.draggableObjects[this.overlap_column].push({
        data: {
          id: moved_file!.id,
          payload: moved_file!,
          name: moved_file!.name,
          currentColumn: this.overlap_column
        },
        zones: this.generateZones(this.overlap_column)
      });
      this.moving_column = this.overlap_column;
    }
  }

  public onZoneDrop(event: any) {
    this.group$.files.sort((a, b) => a.index > b.index ? 1 : -1);
    this.appSvc.update();
    this.pdfSrc = '';
    this.preview(this.group$.files.find((x: FileItem) => x.selected)!.file);
  }

  //drag and drop
  public onZoneEvent(event: any) {
    console.log(event);
    event.data.over ? this.over = true : this.over = false;
    event.data.files && event.data.files.length
      ? (
        /*this.readFileAsText(<File[]>event.data.files),*/
        this.filesData = <File[]>event.data.files,
        this.fileData = <File>event.data.files[0],
        this.fileData.type.match(/application\/pdf\/*/) != null
          ? (
            this.page = 1,
            this.appSvc.addDocs(event.id, this.filesData)
          )
          : false
      )
      : null;
  }
  readFileAsText(_files: File[]) {
    console.log("from group");
    [..._files].map((x: File, index: number) => {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        console.log("read file as text");
        console.log(fileReader.result);
      }
      fileReader.readAsText(x);
    });
  }

  onFile(e: { file?: FileItem, action: string }) {
    switch (e.action) {
      case 'empty':
        this.thumbnails = [];
        this.finalThumbnails = [];
        this.group$.authomatic = undefined;
        break;
      case 'new':
        this.thumbnails = [];
        this.finalThumbnails = [];
        let matchDoubleFaceSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
        let matchDoubleFaceDirectionSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "rotate")?.options?.find((y: ItemOptionGestor) => y.selected);
        let matchPerPageSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "slide_per_page")?.options?.find((y: ItemOptionGestor) => y.selected);
        e.file?.config
          ? this.config = e.file!.config
          : e.file!.config = this.config = {
            perPage: matchPerPageSelected!["value"],
            verticalAlign: 'middle',
            rotation: 0,
            pageDirection: 'vertical',
            doubleFace: matchDoubleFaceSelected!["id"] == "two_faces" ? true : false,
            doubleFaceDirection: matchDoubleFaceDirectionSelected!["id"] == '90' ? true : false
          }
        this.mainFaces = matchDoubleFaceSelected!["id"];
        //this.pages = e.numPages;
        this.pdfSrc = '';
        this.preview(e.file?.file!);
        //set authomatic orientation from first file
        break;
      case 'select':
        this.pdfSrc = '';
        e.file?.config
          ? this.config = e.file!.config
          : e.file!.config = this.config = {
            perPage: 1,
            verticalAlign: 'middle',
            rotation: 0,
            pageDirection: 'vertical'
          }

        this.orientation == 'oblong' && e.file?.authomatic == 'vertical'
          ? (
            this.config.pageDirection = 'horizontal'
          )
          : this.config.pageDirection = 'vertical';
        this.focusedFile.finalThumbnails?.length ? this.page = 1 : this.page = 0;
        //this.pages = e.numPages;
        this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
        this.thumbnails = this.focusedFile.thumbnails!;
        this.finalThumbnails = this.focusedFile.finalThumbnails!;
        this.scrollDiv();
        this.preview(e.file?.file!);
        this.setDisables();
        break;
      case 'delete':
        this.thumbnails = [];
        this.finalThumbnails = [];
        /*if (this.group$.files.length) {
          this.focusedFile = this.group$.files.find((x:FileItem)=> x.selected)!;
          this.focusedFileId = this.focusedFile.id;
          this.thumbnails = this.focusedFile.thumbnails!;
          this.slidePerPage();
          this.preview(this.focusedFile.file);
        } else {
          this.thumbnails = [];
        }*/
        break;
      default: break;
    }
  }
  deletedPages: number = 0;
  incrementPage() {
    (!this.config.doubleFace || this.page == 1) ? this.page++ : this.page = this.page + 2;
    //this.slidePerPage();
    this.scrollDiv();
  }
  decrementPage() {
    this.page > 1
      ? !this.config.doubleFace
        ? this.page--
        : this.page > 2
          ? this.page = this.page - 2
          : this.page = 1
      : this.focusedFile.thumbnails!.length
        ? this.page = 1
        : (this.page = 0, this.pages = 0);
    //this.slidePerPage();
    this.scrollDiv();
  }
  scrollDiv() {
    /*if (this.appSvc.currentAppValue.groups.length == 1) {
      let div: HTMLElement | null = document.getElementById('page'
        + (
          this.thumbnails![(this.page - 1) * this.config.perPage]?.page
          +
          this.focusedFile?.thumbnails?.slice(0, this.thumbnails![(this.page - 1) * this.config.perPage]?.page).filter((x: ThumbnailItem) => x.deleted).length!
        )
        + '-' + this.group$.id)!;
      div?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }*/
  }

  slidePerPage() {
    this.thumbnailsPartial = this.thumbnails!.slice((this.page - 1) * this.slidesPerPage, (((this.page - 1) * this.slidesPerPage) + this.slidesPerPage));
  }

  preview(_file: File) {
    console.log(_file);
    // Show preview
    var mimeType = _file.type!;
    this.blobToBase64(_file).then(data => {
      this.pdfSrc = `${data}`;
      //console.log(this.pdfSrc);
    })

  }

  blobToBase64(blob: any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  deleteFromCanvas(e: FileItem) {
    console.log(this.group$);
    this.thumbnails = [];
    this.finalThumbnails = [];
    this.group$.files.map(x => x.index > e.index ? x.index = x.index - 1 : null);
    this.group$.files = this.group$.files.filter(x => x.id != e.id);
    this.appSvc.update();
    alert('here');
    console.log(this.appSvc.currentAppValue);
  }

  pageRendered() {
    this.pdfComponent.pdfViewer.currentScaleValue = 'page-fit';
  }
  remainingPdfPages!: any[];
  thumbnails: ThumbnailItem[] = [];
  finalThumbnails: ThumbnailItem[] = [];
  thumbnailsPartial: ThumbnailItem[] = [];





  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.group$.files.find(x => x.selected)!.numPages = pdf.numPages;
    this.remainingPdfPages = new Array(pdf.numPages - 1);
    if (!this.focusedFile.thumbnails?.length) {
      this.rendering = true;
      this.appSvc.setAnyParam('spinner', true);
      this.focusedFile.thumbnails = new Array(pdf.numPages - 1);
      let countDown = pdf.numPages;
      this.focusedFile.finalNumPages = this.pages = pdf.numPages;
      for (let i = 1; i < pdf.numPages + 1; i++) {
        pdf.getPage(i).then((page: PDFPageProxy) => {
          let viewport = page.getViewport({ scale: 1 });
          let canvas: any = document.createElement('canvas');
          let context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          i == 1 ? canvas.width > canvas.height ? this.focusedFile.authomatic = 'oblong' : this.focusedFile.authomatic = 'vertical' : null;
          let renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          let end: Promise<any> = page.render(renderContext).promise;
          end.then(result => {
            countDown--;
            this.focusedFile.thumbnails![i - 1] = {
              page: i,
              url: canvas.toDataURL()
            };
            if (!countDown) {
              this.focusedFile.finalThumbnails = this.focusedFile.thumbnails;
              this.focusedFile.finalThumbnails![0].focused = true;
              this.thumbnails = this.focusedFile.thumbnails!;
              this.finalThumbnails = this.thumbnails;
              this.group$.authomatic == undefined
                ? (
                  this.group$.authomatic = this.focusedFile.authomatic,
                  this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "orientation")?.options?.map((y: ItemOptionGestor) => {
                    y["id"] == this.focusedFile.authomatic ? y.selected = true : y.selected = false
                  }),
                  this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "turn-page")?.options?.map((y: ItemOptionGestor) => {
                    this.focusedFile.authomatic == 'oblong'
                      ? (
                        y['id'] == 'long-side'
                          ? y.selected = false
                          : y.selected = true
                      )
                      : null;
                  })
                )
                : null;
              this.orientation == 'oblong' && this.focusedFile.authomatic == 'vertical'
                ? (
                  this.config.pageDirection = 'horizontal'
                )
                : null;
              this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
              let matchDoubleFaceSelected = this.group$?.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
              if (matchDoubleFaceSelected) {
                matchDoubleFaceSelected!["id"] == "two_faces" ? this.focusedFile.finalSheets = Math.ceil(this.focusedFile.finalNumPages! / 2) : this.focusedFile.finalSheets = this.focusedFile.finalNumPages;
              }
              this.updateApp();
              this.setDisables();
              this.checkRenders();
            }
          }).catch(onrejectionhandled => console.log(onrejectionhandled))
        });
      }
    } else {
      /*this.thumbnails = this.focusedFile.thumbnails!;
      this.finalThumbnails = this.focusedFile.finalThumbnails!;
      this.page =1;*/
      //this.slidePerPage();
    }
  }

  checkRenders() {
    let matchNoRenderedFile: FileItem = this.group$.files.find((file: FileItem, index: number) => !file.finalThumbnails)!;
    if (matchNoRenderedFile) {
      this.group$.files.map(x => x.selected = false);
      this.group$.files.find(x => x.id == matchNoRenderedFile.id)!.selected = true;
      this.updateApp();
    } else {
      this.appSvc.setAnyParam('spinner', false);
    }
  }

  imageWidth: string = "100%";
  config: FileItemConfig = { perPage: 1, verticalAlign: 'middle', rotation: 0, pageDirection: 'vertical' };
  configEnables: { [key: string]: any } = {
    perFace: {
      disable: true,
      options: {
        1: true,
        2: true,
        3: false
      }
    },
    rotation: {
      disable: false
    },
    doubleFaceDirection: {
      disable: false
    }
  }
  setStapledCreased() {
    let matchItem: ItemGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "orientation")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'vertical' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "turn-page")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'long-side' ? (x['active'] = true, x['selected'] = true) : (x['active'] = false, x['selected'] = false));
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "faces")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'two_faces' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "rotate")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == '0' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));
    this.updateApp();
    this.setSheets();
  }
  unsetStapledCreased() {
    let matchItem: ItemGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "finished")!;
    if (this.mainFinished == 'stapled-creased' && matchItem.options!.find((x: ItemOptionGestor) => x.selected)!['id'] == 'stapled-creased') {
      matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'stapled-creased' ? (x['active'] = true, x['selected'] = false) : x['id'] == 'none' ? (x['active'] = true, x['selected'] = true) : null);
      this.mainFinished = 'none';
      this.updateApp();
      this.setSheets();
    }
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "orientation")!;
    if (this.mainFinished == 'stapled-creased' && matchItem.options!.find((x: ItemOptionGestor) => x.selected)!['id'] == 'oblong') {
      matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'stapled-creased' ? (x['active'] = true, x['selected'] = false) : x['id'] == 'none' ? (x['active'] = true, x['selected'] = true) : null);
      this.mainFinished = 'none';
      this.updateApp();
      this.setSheets();
    }
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "rotate")!;
    if (this.mainFinished == 'stapled-creased' && this.mainRotation == '0' && matchItem.options!.find((x: ItemOptionGestor) => x.selected)!['id'] == '0') {
      matchItem.options!.map((x: ItemOptionGestor) => x['id'] == '90' ? (x['active'] = true, x['selected'] = false) : x['id'] == 'none' ? (x['active'] = true, x['selected'] = true) : null);
      this.mainRotation = '0';
      this.updateApp();
      this.setSheets();

    }
  }
  setStapled() {
    let matchItem: ItemGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "orientation")!;
    /*matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'vertical' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));*/
    /*matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "turn-page")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'long-side' ? (x['active'] = true, x['selected'] = true) : (x['active'] = false, x['selected'] = false));*/
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "faces")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == 'one_face' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));
    matchItem = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "rotate")!;
    matchItem.options!.map((x: ItemOptionGestor) => x['id'] == '0' ? (x['active'] = true, x['selected'] = true) : (x['active'] = true, x['selected'] = false));
    this.updateApp();
    this.setSheets();
  }
  setPerPage(_perPage: number) {
    //this.imageWidth = "100%";
    this.page = 1;
    this.config.perPage = _perPage;
    this.focusedFile.config = this.config;
    this.resizeInitialWidthImage();
    //this.pages = Math.ceil(this.focusedFile.numPages! / this.config.perPage);
    this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
    this.setSheets();
    //once selected per page adjust colors from each group to first one
    //if (this.config.perPage != 1) {
    this.setColor('none');
    //}
    this.config.doubleFaceDirection = false;
    this.setDisables();
    this.updateApp();
  }
  setDoubleFace() {
    this.page = 1;
    this.config.doubleFace = !this.config.doubleFace;
    this.config.doubleFaceDirection = false;
    this.focusedFile.config = this.config;
    this.updateApp();
    //this.setSheets();
    this.setDisables()
    this.updateApp();
  }
  setDoubleFaceDirection() {
    this.config.doubleFaceDirection = !this.config.doubleFaceDirection;

  }
  ungroup() {
    this.group$.ungrouped = !this.group$.ungrouped;
    this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "grouping")?.options?.map((y: ItemOptionGestor) => {
      !this.group$.ungrouped
        ? y["id"] == "grouped"
          ? y.selected = true
          : y.selected = false
        : y["id"] == "ungrouped"
          ? y.selected = true
          : y.selected = false
    });
    this.updateApp();
  }
  resizeInitialWidthImage() {
    if (this.focusedFile.authomatic == 'vertical') {
      if (this.orientation == 'vertical') {
        switch (this.config.perPage) {
          case 1:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
          case 2:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
          case 4:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
        }
      } else {
        switch (this.config.perPage) {
          case 1:
            !this.config.rotation ? this.imageWidth = "50%" : this.imageWidth = "70%";
            break;
          case 2:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
          case 4:
            !this.config.rotation ? this.imageWidth = "50%" : this.imageWidth = "50%";
            break;
        }
      }

    } else if (this.focusedFile.authomatic == 'oblong') {
      if (this.orientation == 'vertical') {
        switch (this.config.perPage) {
          case 1:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "140%";
            break;
          case 2:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
          case 4:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "140%";
            break;
        }
      } else {
        switch (this.config.perPage) {
          case 1:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
          case 2:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "140%";
            break;
          case 4:
            !this.config.rotation ? this.imageWidth = "100%" : this.imageWidth = "70%";
            break;
        }
      }
    }
    //control image width for page not complete
    //if one no problem
    //if two no rotate no problem
    //if to and rotate
    let numSlides = this.focusedFile.finalThumbnails?.slice((this.page - 1) * this.config.perPage, this.page * this.config.perPage).length;
    let numSlidesDoubleFace = this.focusedFile.finalThumbnails?.slice(((this.page) * this.config.perPage), (this.page + 1) * this.config.perPage).length;
    let matchFinalThumbnails: ThumbnailItem[] = this.focusedFile.finalThumbnails!;
    let empty: ThumbnailItem = { page: 0, url: null };
    matchFinalThumbnails && matchFinalThumbnails.length
      ? empty = JSON.parse(JSON.stringify(matchFinalThumbnails![0]))
      : null;
    empty.hidden = true;
    if (this.page == this.pages) {
      switch (this.config.perPage) {
        case 2:
          switch (numSlides) {
            case 1:
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            default:
              break;
          }
          break;
        case 4:
          switch (numSlides) {
            case 1:
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 2:
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 3:
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 4:
              break;
            default:
              break;
          }
          break;
        default: break;
      }
    } else if (this.config.doubleFace && this.page >= this.page - 1) {
      switch (this.config.perPage) {
        case 2:
          switch (numSlidesDoubleFace) {
            case 1:
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            default:
              break;
          }
          break;
        case 4:
          switch (numSlidesDoubleFace) {
            case 1:
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 2:
              this.focusedFile.finalThumbnails!.push(empty);
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 3:
              this.focusedFile.finalThumbnails!.push(empty);
              break;
            case 4:
              break;
            default:
              break;
          }
          break;
        default: break;
      }
    }

  }
  adjustNumSlides!: string;
  setDisables() {
    if (this.focusedFile) {
      this.config.doubleFace && this.config.rotation
        ? this.configEnables['doubleFaceDirection']['disable'] = false
        : this.configEnables['doubleFaceDirection']['disable'] = true;
      switch (this.focusedFile.authomatic) {
        case 'vertical':
          switch (this.orientation) {
            case 'vertical':
              switch (this.config.perPage || !this.config.perPage) {
                case 1:
                  this.config.pageDirection = 'vertical';
                  //this.config.rotation = 0;
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 2:
                  this.config.pageDirection = 'horizontal';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 4:
                  this.config.pageDirection = 'vertical';
                  //this.config.rotation = 0;
                  this.configEnables['rotation']['disable'] = false;
                  break;
                default:
                  break;
              }
              break;
            case 'oblong':
              switch (this.config.perPage || !this.config.perPage) {
                case 1:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 2:
                  //this.config.rotation = 0;
                  this.config.pageDirection = 'horizontal';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 4:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                default:
                  break;
              }
              break;
            default: break;
          }
          break;
        case 'oblong':
          switch (this.orientation) {
            case 'vertical':
              switch (this.config.perPage || !this.config.perPage) {
                case 1:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 2:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 4:
                  this.config.pageDirection = "vertical";
                  this.configEnables['rotation']['disable'] = false;
                  break;
                default:
                  break;
              }
              break;
            case 'oblong':
              switch (this.config.perPage || !this.config.perPage) {
                case 1:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 2:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                case 4:
                  this.config.pageDirection = 'vertical';
                  this.configEnables['rotation']['disable'] = false;
                  break;
                default:
                  break;
              }
              break;
            default: break;
          }
          break;
        default: break;
      }
    }
  }
  setVerticalAlign(_align: string) {
    this.config.verticalAlign = _align;
    this.focusedFile.config = this.config;
  }
  rotation: number = 0;
  rotate() {
    this.config.rotation == -90
      ? (this.config.rotation = 0, this.config.doubleFaceDirection = false)
      : this.config.rotation = -90;
    /*if (this.orientation == 'vertical') {
      this.config.rotation == -90
        ? this.focusedFile.authomatic == 'oblong'
          ? this.config.perPage == 4
            ? this.config.pageDirection = "reverse"
            : this.config.perPage == 2
              ? this.imageWidth = "70%"
              : null
          : this.config.perPage == 2
            ? (this.config.pageDirection = "vertical", this.imageWidth = "50%")
            : null
        : this.config.perPage == 2 && this.focusedFile.authomatic == 'vertical'
          ? (this.config.pageDirection = "horizontal", this.imageWidth = "100%")
          : (this.config.pageDirection = "vertical", this.imageWidth = "100%")
    } else {
      this.focusedFile.authomatic == 'vertical'
        ? this.config.perPage == 1
          ? this.imageWidth = "50%"
          : null
        : null
    }*/
    this.resizeInitialWidthImage();
    this.focusedFile.config = this.config;
    this.setDisables();
    this.updateApp();
  }
  pageOrder(_pageOrientation: string) {
    this.config.pageDirection = _pageOrientation;
    this.focusedFile.config = this.config;
  }
  public mainVisor!: boolean;
  toogleMainVisor(e: Event) {
    e.preventDefault();
    this.mainVisor = !this.mainVisor;
    this.group$['visible_options'] = this.mainVisor;
  }
  selectPage(_item: ThumbnailItem) {
    if (_item?.page == 1 || this.focusedFile.finalThumbnails?.length == 1) {
      this.page = 1;
    } else if (!this.config.doubleFace || this.focusedFile.finalThumbnails?.length == 2) {
      if (_item) {
        this.page = Math.ceil((_item.page - this.focusedFile.thumbnails?.slice(0, _item.page).filter((x: ThumbnailItem) => x.deleted).length!) / this.config.perPage);//- this.focusedFile.thumbnails?.slice(0, _item.page).filter((x: ThumbnailItem) => x.deleted).length!;
      }
    } else {
      let ref: number = Math.ceil((this.focusedFile.finalThumbnails?.findIndex((x: ThumbnailItem) => x.page == _item.page)! + 1) / this.config.perPage);
      ref == 1
        ? this.page = 1
        : !(Math.ceil(ref % 2))
          ? this.page = ref
          : this.page = ref - 1;
      /*!(_item?.page % 2)
        ? this.page = Math.ceil((_item.page - this.focusedFile.thumbnails?.slice(0, _item.page).filter((x: ThumbnailItem) => x.deleted).length!) / this.config.perPage)
        : this.page = Math.ceil((_item.page - this.focusedFile.thumbnails?.slice(0, _item.page).filter((x: ThumbnailItem) => x.deleted).length!) / this.config.perPage) - 1*/
    }
    this.page > this.pages ? this.page = this.pages : null;
    this.setFocused();
    this.scrollDiv();
  }
  setFocused() {
    this.finalThumbnails?.map((x: ThumbnailItem) => x.focused = false);
    this.finalThumbnails.length
      ? this.finalThumbnails?.slice((this.page - 1) * this.config.perPage, this.page * this.config.perPage).map((x: ThumbnailItem) => x.focused = true)
      : null;
  }

  selectDelete(e: Event, _item: ThumbnailItem) {
    !this.page ? this.page = 1 : null;
    e.preventDefault();
    _item.deleted = !_item.deleted;
    _item.deleted
      ? this.deletedPages++
      : this.deletedPages--;
    this.focusedFile.finalThumbnails = this.finalThumbnails = this.thumbnails.filter((x: ThumbnailItem) => !x.deleted);
    if (this.focusedFile.finalThumbnails.length) {
      if (_item.deleted) {
        if (_item.focused) {
          _item.focused = false;
          this.decrementPage();
          /*if(_item.page== 1){
            this.selectPage(this.findNextBigger(this.focusedFile.finalThumbnails, _item.page))
          }else if (_item.page > this.focusedFile.finalThumbnails.length) {
            !this.config.doubleFace
              ? this.selectPage(this.focusedFile.finalThumbnails[this.focusedFile.finalThumbnails.length - 1])
              : this.focusedFile.finalThumbnails[this.focusedFile.finalThumbnails.length - 1].page % 2
                ? this.selectPage(_item)
                : this.selectPage(this.focusedFile.finalThumbnails[this.focusedFile.finalThumbnails.length - 1])
          } else if (_item.page < this.focusedFile.finalThumbnails[0].page) {
            this.selectPage(this.focusedFile.finalThumbnails[0]);
          } else {
            this.selectPage(this.findNextBigger(this.focusedFile.finalThumbnails, _item.page));
          }*/
        } else {
          /*!this.config.doubleFace
            ? this.page--
            : this.selectPage(this.findNextBigger(this.focusedFile.finalThumbnails, _item.page-2));*/
        }
      } else if (this.focusedFile.finalThumbnails.length == 1) {
        //this.selectPage(_item);
      }
    } else {
      this.page = 0;
    }
    //this.pages = this.focusedFile.finalThumbnails.length;
    this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
    this.setSheets();
    //this.setSheets();
    this.setFocused();
    if (this.config.perPage != 1) {
      this.setColor('none');
    }

    this.setFocused();
    this.updateApp();
  }

  findNextBigger(_array: ThumbnailItem[], _page: number) {
    let match: ThumbnailItem;
    _array.map((x: ThumbnailItem) => {
      !match && x.page > _page
        ? match = x
        : null;
    })
    if (!this.config.doubleFace) {
      return match!
    } else {
      if (match!.page % 2) {
        return _array[match!.page - 1]
      } else {
        return match!
      }
    }
  }
  selectColor(e: Event, _item: ThumbnailItem) {
    e.preventDefault();
    _item.color = !_item.color;
    if (this.config.perPage != 1) {
      if (_item.focused) {
        this.finalThumbnails?.slice((this.page - 1) * this.config.perPage, this.page * this.config.perPage).map((x: ThumbnailItem) => x.color = _item.color);
      } else {
        this.finalThumbnails?.slice((Math.ceil(_item.page / this.config.perPage) - 1) * this.config.perPage, Math.ceil(_item.page / this.config.perPage) * this.config.perPage).map((x: ThumbnailItem) => x.color = _item.color);
      }
    }
    this.updateApp();
  }
  check(_value: string) {
    switch (_value) {
      case 'all':
        this.focusedFile.thumbnails?.map((x: ThumbnailItem) => x.deleted = false);
        this.finalThumbnails = this.focusedFile.finalThumbnails = this.focusedFile.thumbnails!;
        this.page = 1;
        this.focusedFile.finalNumPages = this.pages = Math.ceil(this.focusedFile.finalThumbnails?.length! / this.config.perPage);
        this.setSheets();
        break;
      case 'none':
        this.focusedFile.thumbnails?.map((x: ThumbnailItem) => (x.deleted = true, x.focused = false));
        this.finalThumbnails = this.focusedFile.finalThumbnails = [];
        this.page = 0;
        this.focusedFile.finalNumPages = this.pages = 0;
        this.focusedFile.finalSheets = 0;
        break;
    }
    this.updateApp();
  }
  setColor(_value: string) {
    switch (_value) {
      case 'all':
        this.focusedFile.thumbnails?.map((x: ThumbnailItem) => x.color = true)
        break;
      case 'none':
        this.focusedFile.thumbnails?.map((x: ThumbnailItem) => x.color = false)
        break;
    }
    this.updateApp();
  }

  updateApp() {
    let ss: Group = this.appSvc.currentAppValue.groups.find((x: Group) => x.id == this.group$.id)!;
    ss ? ss = this.group$ : null;
    this.appSvc.currentAppValue.gestor = this.group$.gestor;
    this.appSvc.currentAppSubject.next(this.appSvc.currentAppValue);
  }

  toogleMax!: boolean;
  showBig() {
    this.toogleMax = !this.toogleMax;
  }
  setFinished() {

    let matchItemFinishedOrientation: ItemOptionGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "turn-page")?.options?.find((y: ItemOptionGestor) => y.selected)!;
    if (matchItemFinishedOrientation) {
      this.mainTurnPage = matchItemFinishedOrientation["id"]
      if ((this.orientation == 'vertical' && matchItemFinishedOrientation["id"] == "long-side") || (this.orientation == 'oblong' && matchItemFinishedOrientation["id"] != "long-side")) {
        this.finishedOrientation = false
      } else if ((this.orientation == 'vertical' && matchItemFinishedOrientation["id"] != "long-side") || (this.orientation == 'oblong' && matchItemFinishedOrientation["id"] == "long-side")) {
        this.finishedOrientation = true
      }
      this.mainTurnPage == 'short-side' && this.mainFinished == 'stapled-creased'
        ? this.unsetStapledCreased()
        : null;
    }

    let matchItem: ItemOptionGestor = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == "finished")?.options?.find((y: ItemOptionGestor) => y.selected)!;
    let matchFinished: any = matchItem["innerHTML"];
    !matchItem["related-finished"] && !matchItem["related-section-finished"]
      ? matchFinished && matchFinished["visible"]
        ? (
          this.finished = matchFinished["content"]
          , this.mainFinished != matchItem["id"]
            ? (this.page = 1, this.mainFinished = matchItem["id"])
            : null
        )
        : (
          this.finished = "",
          this.mainFinished != matchItem["id"]
            ? (this.page = 1, this.mainFinished = matchItem["id"])
            : null
        )
      : matchItem["related-finished"]
        ? (
          matchFinished = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == matchItem["related-finished"])?.options?.find((y: ItemOptionGestor) => y.selected)!["innerHTML"],
          matchFinished && matchFinished["visible"]
            ? (
              this.finished = matchFinished["content"]
              , this.mainFinished != matchItem["id"]
                ? (this.page = 1, this.mainFinished = matchItem["id"])
                : null
            )
            : this.finished = ""
        )
        : matchItem["related-section-finished"]
          ? (
            matchFinished = this.group$?.gestor.options.find((x: ItemGestor) => x['id'] == matchItem["related-section-finished"])?.options?.find((y: ItemOptionGestor) => y.selected)!["innerHTML"],
            matchFinished && matchFinished["visible"]
              ? (
                this.finished = matchFinished["content"]
                , this.mainFinished != matchItem["id"]
                  ? (this.page = 1, this.mainFinished = matchItem["id"])
                  : null
              )
              : this.finished = ""
          )
          : this.finished = "";
  }

  private setSheets() {

    let matchFinished: ItemGestor = this.group$.gestor.options.find((x: ItemGestor) => x['id'] == 'finished')!
    let matchFinishedSelected: string = matchFinished.options!.find((x: ItemOptionGestor) => x.selected)!['id'];
    if (matchFinished && matchFinishedSelected == 'stapled-creased') {
      this.focusedFile.finalSheets = Math.ceil(Math.ceil(this.focusedFile.finalNumPages! / 2) / 2);
    } else {
      this.focusedFile.finalSheets = this.focusedFile.config?.doubleFace ? Math.ceil(this.focusedFile.finalNumPages! / 2) : this.focusedFile.finalNumPages;
    }
    /*let matchDoubleFaceSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
    if (matchDoubleFaceSelected) {
      if (this.mainFaces != matchDoubleFaceSelected["id"]) {
        this.mainFaces = matchDoubleFaceSelected["id"];
        this.group$.files.map((x: FileItem) => {
          matchDoubleFaceSelected!["id"] == "two_faces" ? x.finalSheets = Math.ceil(x.finalNumPages! / 2) : x.finalSheets = x.finalNumPages;
        });
      }
    }*/
    this.updateApp();
  }

  private setAllFilesNumPagesSheets() {
    let matchDoubleFaceSelected = this.group$.gestor.options.find((x: ItemGestor) => x["id"] == "faces")?.options?.find((y: ItemOptionGestor) => y.selected);
    this.group$.files.map((x: FileItem) => {
      x.finalNumPages = this.pages = Math.ceil(x?.finalThumbnails?.length! / x.config!.perPage);
      matchDoubleFaceSelected!["id"] == "two_faces" ? x.finalSheets = Math.ceil(x.finalNumPages! / 2) : x.finalSheets = x.finalNumPages;
    });
    //this.updateApp();
  }

}