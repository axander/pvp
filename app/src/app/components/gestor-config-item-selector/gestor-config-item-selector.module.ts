import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestorConfigItemSelectorComponent } from './gestor-config-item-selector.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    GestorConfigItemSelectorComponent
  ],
  exports: [
    GestorConfigItemSelectorComponent
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
    PipesModule
  ]
})
export class GestorConfigItemSelectorModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "") + environment.api.translations, '.json?date=' + new Date().getTime());
}