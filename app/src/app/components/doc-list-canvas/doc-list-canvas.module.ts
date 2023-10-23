import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocListCanvasComponent } from './doc-list-canvas.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    DocListCanvasComponent
  ],
  exports: [
    DocListCanvasComponent
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
  ]
})
export class DocListCanvasModule { }


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}

