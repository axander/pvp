import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsGroupItemFooterComponent } from './documents-group-item-footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    DocumentsGroupItemFooterComponent
  ],
  exports: [
    DocumentsGroupItemFooterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class DocumentsGroupItemFooterModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}