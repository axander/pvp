import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader.component';
import { DroppableDirective } from './drop.directive';
import { DragService } from './drag.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    FileUploaderComponent, DroppableDirective
  ],
  exports: [
    FileUploaderComponent, DroppableDirective
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
  ],
  providers: [DragService]
})
export class FileUploaderModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "")+environment.api.translations, '.json?date=' + new Date().getTime());
}