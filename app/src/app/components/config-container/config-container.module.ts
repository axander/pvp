import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigContainerComponent } from './config-container.component';
import { GestorConfigItemModule } from '../gestor-config-item/gestor-config-item.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    ConfigContainerComponent
  ],
  exports: [
    ConfigContainerComponent
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
    GestorConfigItemModule
  ]
})
export class ConfigContainerModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}
