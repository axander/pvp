import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress.component';



@NgModule({
  declarations: [
    ProgressComponent
  ],
  exports: [
    ProgressComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProgressModule { }
