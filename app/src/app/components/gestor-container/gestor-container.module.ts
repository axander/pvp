import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestorContainerComponent } from './gestor-container.component';
import { DocumentsContainerModule } from '../documents-container/documents-container.module';
import { ConfigContainerModule } from '../config-container/config-container.module';



@NgModule({
  declarations: [
    GestorContainerComponent
  ],
  exports: [GestorContainerComponent],
  imports: [
    CommonModule,
    DocumentsContainerModule,
    ConfigContainerModule
  ]
})
export class GestorContainerModule { }
