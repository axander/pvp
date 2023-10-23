import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsContainerComponent } from './documents-container.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { DocumentsGroupModule } from '../documents-group/documents-group.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { OrderContainerFooterModule } from '../order-container-footer/order-container-footer.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ContentModule } from '../content/content.module';

@NgModule({
  declarations: [
    DocumentsContainerComponent
  ],
  exports: [
    DocumentsContainerComponent
  ],
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
    DocumentsGroupModule,
    FileUploaderModule,
    OrderContainerFooterModule,
    ContentModule
  ]
})
export class DocumentsContainerModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}
