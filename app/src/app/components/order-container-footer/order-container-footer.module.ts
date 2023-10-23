import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderContainerFooterComponent } from './order-container-footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    OrderContainerFooterComponent
  ],
  exports: [
    OrderContainerFooterComponent
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
export class OrderContainerFooterModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}