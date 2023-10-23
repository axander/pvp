import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from './services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './services/api/api.service';
import { AppConfigService } from './services/app.config.service';

//jwt
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
import * as CryptoJS from 'crypto-js';
import { AppConfig, Link } from './models/App.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Input('token') token!: string;

  secretKey = "raahaHeiratyAlejandroMRomero";

  initialized!: boolean;

  title = 'app';
  appLstnr: Subscription = new Subscription;
  //-----------
  active?: boolean = false;
  ordering?: boolean = false;
  ordering_spinner?: string;
  intro?: boolean;
  //-----------
  /*----------info*/
  infoStyle!: string;
  infoStyleOpen!: string;
  modalStyle!: string;
  modalStyleOpen!: any;
  contentInfo!: string;
  spinner!: boolean;
  constructor(
    private helper: JwtHelperService,
    public translate: TranslateService,
    private appSvc: AppService,
    private apiSvc: ApiService,
    private appConfigSvc: AppConfigService
  ) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
    this.translate.use(translate.defaultLang);
    /*localStorage.setItem('token', this.signToken(
      {
        "test":true,
        "host":
          "digicopy.com.es",
        "redirect": "https://raanaheyrati.com/",
        "license": {
          "value": "standard"
        }
      }
      , 'raahaHeyratiAlejandroMRomero'));*/
    //localStorage.setItem('token', this.encrypt({'iis':'https://www.digicopy.com.es'}));
    //jwt
    /*const decodedToken = helper.decodeToken(myRawToken);
    // Other functions
    const expirationDate = helper.getTokenExpirationDate(myRawToken);
    const isExpired = helper.isTokenExpired(myRawToken);*/

    helper = new JwtHelperService();
    //token digicopy
    //let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiZGlnaWNvcHkuY29tLmVzIiwicmVkaXJlY3QiOiJodHRwczovL3JhYW5haGV5cmF0aS5jb20vIiwibGljZW5zZSI6eyJ2YWx1ZSI6InN0YW5kYXJkIn19.ZpjOSyo56QAsbNPnJ1-QSBPfE8s0SLSQSrHt9buzxeE';

    let token = localStorage.getItem('token');
    let decodedPluginData: any = this.helper.decodeToken(token!);
    this.appSvc.setAnyParam('token', { value: token, decoded: decodedPluginData });
    decodedPluginData.test ? null : localStorage.removeItem('token');
    let tokenScript = document.getElementById('securityScript');
    let head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    head && tokenScript ? head!.removeChild(tokenScript!) : null;
    //this.accept = this.auth.getToken().then(result => {
    if (location.host == decodedPluginData['host'] || location.host == 'localhost:4200') {
    } else {
      location.href = decodedPluginData['redirect'];
    }
  }
  ngOnInit() {
    console.log = function () { };
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {
      this.active = data.active;
      this.ordering = data.ordering;
      this.ordering_spinner = data.ordering_spinner;
      this.intro = data['intro'] ? data['intro']['visible'] : false;
      this.spinner = data.spinner!;
    });

    this.appConfigSvc.load().then(result => {
      this.initialized = true;
      console.log(result);
      this.appSvc.setAppConfig(result);
      this.addMainStyle();
      this.addExternalLink();
      if (this.appSvc.currentAppValue.configToStart) {
        let config: AppConfig = this.appSvc.currentAppValue.configs!.find((x: AppConfig) => x['id'] == this.appSvc.currentAppValue.configToStart)!;
        this.appSvc.setGestorConfig(this.appSvc.currentAppValue.configToStart, config.gestor!);
      }
      try {
        this.contentInfo = result['intro']['steps'][0].code;

      } catch (e) {
        console.log(e);
      }

      /*try {
        this.infoStyle = result['info_modal']['info']['style'];
        this.infoStyleOpen = result['info_modal']['info_open']['style'];
        this.modalStyle = result['info_modal']['modal']['style'];
        this.modalStyleOpen = result['info_modal']['modal_open']['style'];
        
      } catch (e) {

      }*/
    })
    /*this.apiSvc.getConfig().then(result => {
      console.log(JSON.parse(result[0]));
    });*/
  }
  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
  toogleInfo() {
    this.appSvc.toogleIntro();
  }
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  base64url(source: any) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);

    encodedSource = encodedSource.replace(/=+$/, '');

    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }

  encodeToken(payload: any) {
    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));

    var encodedHeader = this.base64url(stringifiedHeader);

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    var encodedData = this.base64url(stringifiedData);

    return encodedHeader + "." + encodedData;
  }

  signToken(payload: any, key: string) {

    var secret = key;
    let token: any = this.encodeToken(payload);


    var signature: any = CryptoJS.HmacSHA256(token, secret);
    signature = this.base64url(signature);

    var signedToken = token + "." + signature;
    return signedToken;
  }

  addMainStyle() {
    let style: HTMLStyleElement = document.createElement('style');
    style.id = "cpdo_style";
    let css: string;
    this.appSvc.currentAppValue.styling!.rules.map((cssRule: any) => {
      cssRule['active']
        ? (css = `${cssRule['id']}{${cssRule['value']}}`, style.appendChild(document.createTextNode(css)))
        : null;
    });
    document.head.appendChild(style);
  }
  addExternalLink() {
    let linkElement: HTMLLinkElement = document.createElement('link');
    let css: string;
    this.appSvc.currentAppValue.links?.map((link: Link) => {
      link.active!
        ? (
          linkElement.href = link.href!,
          linkElement.rel = link.rel!,
          document.head.appendChild(linkElement)
        )
        : null;
    });

  }

}
