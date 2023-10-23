import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContainerModule } from './components/main-container/main-container.module';
import { GestorContainerModule } from './components/gestor-container/gestor-container.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { JwtInterceptor } from './components/shared/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './components/shared/interceptor/error.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './services/app.config.service';
import { VersionService } from './services/version.service';
import { OrderingModule } from './components/ordering/ordering.module';
import es from '@angular/common/locales/es';
import { SpinnerModule } from './components/spinner/spinner.module';
import { IntroModule } from './components/intro/intro.module';
import { PipesModule } from './pipes/pipes.module';

//jwt
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter() {
  return "undefined.qcYnh_vsVlTs2b71jrdEVLNHw80z30ouDKqdumQJKZQ";
}

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    /*JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["https://www.digicopy.com.es"]
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),*/
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule,
    SpinnerModule,
    MainContainerModule,
    GestorContainerModule,
    OrderingModule,
    IntroModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: LOCALE_ID, useValue: "es-ES" }, //your locale
    JwtHelperService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInit,
      multi: true,
      deps: [AppConfigService]
    },
    VersionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, (environment.deploy ? localStorage.getItem("root") : "") + environment.api.translations, '.json?date=' + new Date().getTime());
}
//
export function appConfigInit(appConfigService: AppConfigService) {
  return () => {
    var is_root = location.pathname == "/";
    if ((window.location.protocol + "//" + window.location.host) != localStorage.getItem("root")) {
      return appConfigService.load()
    } else {
      return true
    }
  };
}

/*

JwtHelperService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInit,
      multi: true,
      deps: [AppConfigService]
    },

*/