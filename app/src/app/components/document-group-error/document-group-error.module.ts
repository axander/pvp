import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentGroupErrorComponent } from './document-group-error.component';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    DocumentGroupErrorComponent
  ],
  exports: [
    DocumentGroupErrorComponent
  ],
  imports: [
    PipesModule,
    CommonModule
  ]
})
export class DocumentGroupErrorModule { }
