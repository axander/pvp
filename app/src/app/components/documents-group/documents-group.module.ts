import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsGroupComponent } from './documents-group.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { DocumentsGroupItemModule } from '../documents-group-item/documents-group-item.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { DocumentsGroupItemFlagsModule } from '../documents-group-item-flags/documents-group-item-flags.module';
import { DocumentsGroupItemFooterModule } from '../documents-group-item-footer/documents-group-item-footer.module';
import { DragService } from './drag.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocListCanvasModule } from '../doc-list-canvas/doc-list-canvas.module';
import { DocumentGroupErrorModule } from '../document-group-error/document-group-error.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DraggableDirective } from './drag.directive';
import { DroppableDirective } from './drop.directive';

@NgModule({
  declarations: [
    DocumentsGroupComponent,DroppableDirective,DraggableDirective
  ],
  exports:[DocumentsGroupComponent,DroppableDirective,DraggableDirective],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule,
    PdfViewerModule,
    DocumentsGroupItemModule,
    FileUploaderModule,
    DocumentsGroupItemFlagsModule,
    DocumentsGroupItemFooterModule,
    DocListCanvasModule,
    DocumentGroupErrorModule
  ],
  providers: [DragService]
})
export class DocumentsGroupModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}