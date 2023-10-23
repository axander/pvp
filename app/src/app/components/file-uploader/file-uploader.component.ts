import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  @Input("mode") mode?: string;
  @Input("id") id?: number;
  logo!: string;
  filesData!: File[];
  fileData!: File;
  previewUrl: any;
  fileUploadProgress!: string;
  uploadedFilePath!: string;
  base64String!: string;

  //dropping
  over!: boolean;

  //file reader
  input: any;

  constructor(
    private appSvc: AppService
  ) {
    this.appSvc.currentAppValue['logo'] ? this.logo = this.appSvc.currentAppValue['logo']!['content'] : null;
  }

  ngOnInit() { }

  activeApp() {
    console.log("iniciar");
    this.appSvc.gestorActivate();
  }

  fileProgress(fileInput: any) {
    console.log("inside progress");
    this.fileData = <File>fileInput.target.files[0];
    var mimeType = this.fileData.type;
    if (mimeType.match(/application\/pdf\/*/) != null) {
      if (this.mode == 'singularDocGroup') {
        this.appSvc.addDocs(this.id!, <File[]>fileInput.target.files)
      } else if (this.mode == 'singularDoc') {
        this.appSvc.addDocs(this.id!, <File[]>fileInput.target.files)
      } else if (this.mode == 'addGroup') {
        this.appSvc.setNewGroup(<File[]>fileInput.target.files);
      } else if (this.mode == 'emptyGestor') {
        this.appSvc.setNewGroup(<File[]>fileInput.target.files);
      } else {
        this.activeApp();
        this.appSvc.setNewGroup(<File[]>fileInput.target.files);
      }
      this.preview();
    }

  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      //Converting Binary Data to base 64
      this.base64String = window.btoa(this.previewUrl);
      /*console.log(this.form);
      this.form.controls['image'].setValue(reader.result)*/

    }

  }
  //drag and drop
  public onZoneEvent(event: any) {
    event.data.over ? this.over = true : this.over = false;
    event.data.files && event.data.files.length
      ? (
        this.filesData = <File[]>event.data.files,
        this.fileData = <File>event.data.files[0],
        this.fileData.type.match(/application\/pdf\/*/) != null
          ? (
            this.readFileAsText(this.filesData),
            this.mode == 'singularDocGroup'
              ? null //this.appSvc.addDocs(this.id!, this.filesData) responsability from documents.group drag zone event
              : this.mode == 'addGroup'
                ? this.appSvc.setNewGroup(this.filesData)
                : this.mode == 'emptyGestor'
                  ? this.appSvc.setNewGroup(this.filesData)
                  : this.mode == 'singularDoc'
                    ? this.appSvc.addDocs(event.id!, this.filesData)
                    : (
                      this.activeApp(),
                      this.appSvc.setNewGroup(this.filesData)
                    )
          )
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

}