import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroComponent } from './intro.component';



@NgModule({
  declarations: [
    IntroComponent
  ],
  exports: [
    IntroComponent
  ],
  imports: [
    CommonModule
  ]
})
export class IntroModule { }
