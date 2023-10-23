import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Routes } from 'src/assets/const/routes';
import { AuthService } from '.././auth.service';
import { ErrorService } from '.././error.service';
import { SpinnerService } from '../spinner.service';
import { Config } from '../../models/Config.model';
import { Order, Orders } from 'src/app/models/App.model';
import { AppService } from '../app.service';


@Injectable({
    providedIn: 'root'
})

export class ApiService {

    sneak!: string | null;
    [key: string]: any;
    mocked!: string | number | boolean;

    postRequest: HttpRequest<any> = new HttpRequest('POST', '', null);
    getRequest: HttpRequest<any> = new HttpRequest('GET', '');

    constructor(
        private http: HttpClient,
        private authSvc: AuthService,
        private errorSvc: ErrorService,
        private spinnerSvc: SpinnerService,
        private appSvc:AppService
    ) {
        this.sneak = localStorage.getItem('sneak');
    }

    private setURL(_service: string, _subMocked?: any, id?: number | string, _pathParams?: any[]) {
        let url = '';
        let subMocked = (_subMocked && Routes[_service].extra && Routes[_service].extra?.mocks && Routes[_service].extra?.mocks[_subMocked] && Routes[_service].extra?.mocks[_subMocked]);
        if (
            !Routes[_service].unMockedGlobal
            &&
            (
                (!subMocked && (this.authSvc.currentAuthValue.mocked || (!environment?.deploy && Routes[_service].mocked)))
                ||
                (subMocked && subMocked.mocked)
            )
        ) {
            this.mocked = 'active';
            subMocked && subMocked.mocked
                ? url = './' + environment?.mocks?.path + Routes[_service].extra?.mocks[_subMocked]?.pathMocked + '.json'
                : url = './' + environment?.mocks?.path + (Routes[_service].pathMocked ? Routes[_service].pathMocked : Routes[_service].path) + (id ? id : '') + '.json';
        } else {
            this.mocked = false;
            if (Routes[_service].environment) {
                url = environment.api['neutral'].replace('$', Routes[_service].environment) + Routes[_service].module + Routes[_service]?.path;
            } else if (environment.deploy || (!environment.deploy && Routes[_service].remote)) {
                //url =  environment.api[Routes[_service].responsability] + Routes[_service].module + Routes[_service].path + (_pathParams ? `/${_pathParams.join('/')}/` : '/');
                url = `${localStorage.getItem("root") ? localStorage.getItem("root") : ""}${environment.api[Routes[_service].responsability]}${Routes[_service].module}${Routes[_service].path}${_pathParams ? '/' + _pathParams.join('/') : ''}`;
            } else {
                url = (!Routes[_service].remote ? environment.api['local'] : '../') + Routes[_service].path;
            }
        }
        return url
    }

    private toQueryString(query: { [x: string]: any; }): string {
        var parts = [];
        for (var property in query) {
            var value = query[property];
            if (value != null && value != undefined)
                parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value))
        }

        return parts.join('&');
    }

    addToCart(_entry: any): Promise<any> {
        console.log(_entry);
        this.spinnerSvc.setComponentStatus('AddToCart', true);
        this.errorSvc.setComponentStatus('AddToCart', false);
        let url: string = this.setURL('addToCart');
        let params = new HttpParams()
            .set('auth', Routes['addToCart'].auth)
            .set('mocked', this.mocked);
        let order = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.post<any>(url, _entry).subscribe({
                    next: (res) => {
                        this.appSvc.setOrdering("redirecting");
                        window.location.href = localStorage.getItem("root") + '/producto/pedido-online-'+_entry.id;
                        this.spinnerSvc.setComponentStatus('AddToCart', false);
                    },
                    error: (err) => {
                        resolve('error');
                        this.authSvc.currentAuthValue.error = true;
                        this.spinnerSvc.setComponentStatus('AddToCart', false);
                        this.errorSvc.setComponentStatus('AddToCart', true);
                    }
                });
            }, 0);
        });
        return Promise.all([order.catch(err => {
            throw err
        })]).then(([order]) => {
            !order ? order = new Promise((resolve, reject) => { })
                : null;
            return Promise.all([order])
        }, err => {
        });
    }

    createPost(_entry: any): Promise<any> {
        this.spinnerSvc.setComponentStatus('CreatePost', true);
        this.errorSvc.setComponentStatus('CreatePost', false);
        let url: string = this.setURL('createPost');
        let params = new HttpParams()
            .set('auth', Routes['createPost'].auth)
            .set('mocked', this.mocked);
        let config = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.post<any>(url, null, { params: _entry }).subscribe({
                    next: (res) => {
                        resolve(res);
                        this.spinnerSvc.setComponentStatus('GetLocations', false);
                    },
                    error: (err) => {
                        resolve('error');
                        this.authSvc.currentAuthValue.error = true;
                        this.spinnerSvc.setComponentStatus('CreatePost', false);
                        this.errorSvc.setComponentStatus('CreatePost', true);
                    }
                });
            }, 0);
        });
        return Promise.all([config.catch(err => {
            throw err
        })]).then(([config]) => {
            !config ? config = new Promise((resolve, reject) => { })
                : null;
            return Promise.all([config])
        }, err => {
        });
    }

    getConfig(): Promise<any> {
        this.spinnerSvc.setComponentStatus('GetConfig', true);
        this.errorSvc.setComponentStatus('GetConfig', false);
        let url: string = this.setURL('getConfig');
        let params = new HttpParams()
            .set('auth', Routes['getConfig'].auth)
            .set('mocked', this.mocked);
        let config = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.get<any>(url).subscribe({
                    next: (res) => {
                        console.log(res);
                        this.appSvc.setAppConfig(res);
                        this.spinnerSvc.setComponentStatus('GetConfig', false);
                    },
                    error: (err) => {
                        this.spinnerSvc.setComponentStatus('GetConfig', false);
                        this.errorSvc.setComponentStatus('GetConfig', true);
                    }
                });
            }, 0);
        });
        return Promise.all([config.catch(err => {
            throw err
        })]).then(([config]) => {
            !config ? config = new Promise((resolve, reject) => { })
                : null;
            return Promise.all([config])
        }, err => {
        });
    }
    uploadFile(_entry: FormData): Promise<any> {
        this.spinnerSvc.setComponentStatus('UploadFile', true);
        this.errorSvc.setComponentStatus('UploadFile', false);
        let url: string = this.setURL('uploadFile');
        let params = new HttpParams()
            .set('auth', Routes['uploadFile'].auth)
            .set('mocked', this.mocked);
        let config = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.http.post<any>(url, _entry).subscribe({
                    next: (res) => {
                        resolve(res);
                        this.spinnerSvc.setComponentStatus('UploadFile', false);
                    },
                    error: (err) => {
                        resolve('error');
                        this.authSvc.currentAuthValue.error = true;
                        this.spinnerSvc.setComponentStatus('UploadFile', false);
                        this.errorSvc.setComponentStatus('UploadFile', true);
                    }
                });
            }, 0);
        });
        return Promise.all([config.catch(err => {
            throw err
        })]).then(([config]) => {
            !config ? config = new Promise((resolve, reject) => { })
                : null;
            return Promise.all([config])
        }, err => {
        });
    }


}
