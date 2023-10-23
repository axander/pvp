import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestorConfigItemComponent } from './gestor-config-item.component';
import { GestorConfigItemSelectorModule } from '../gestor-config-item-selector/gestor-config-item-selector.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { CounterModule } from '../counter/counter.module';
import { TextareaModule } from '../textarea/textarea.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    GestorConfigItemComponent
  ],
  exports: [
    GestorConfigItemComponent
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
    GestorConfigItemSelectorModule,
    FileUploaderModule,
    CounterModule,
    TextareaModule,
    PipesModule
  ]
})
export class GestorConfigItemModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}