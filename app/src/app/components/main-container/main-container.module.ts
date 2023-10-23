import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContainerComponent } from './main-container.component';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';

@NgModule({
  declarations: [MainContainerComponent],
  exports: [MainContainerComponent],
  imports: [
    CommonModule,
    FileUploaderModule
  ]
})
export class MainContainerModule { }



