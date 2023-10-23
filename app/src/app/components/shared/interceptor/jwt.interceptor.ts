import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Interceptor } from '../../../models/interceptor.model';
import { AuthService } from '../../../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    public currentInterceptorSubject: BehaviorSubject<Interceptor>;
    public currentInterceptorSearch: Observable<Interceptor>;

    interceptor!: Interceptor;

    constructor(
        public auth: AuthService
    ) {
        this.currentInterceptorSubject = new BehaviorSubject<Interceptor>(this.interceptor);
        this.currentInterceptorSearch = this.currentInterceptorSubject.asObservable();
    }
    public get currentInterceptorValue(): Interceptor {
        return this.currentInterceptorSubject.value;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let mocked = request.params.get('mocked');
        let authType = request.params.get('auth');


        mocked === 'active' //convierte todos los metodos a get
            ? request = request.clone({
                params: request.params.delete('mocked').delete('auth'),
                method: 'get',
                url: request.url
            })
            : request = request.clone({
                params: request.params.delete('mocked').delete('auth'),
                setHeaders: {
                    Authorization: 'Basic ' + window.btoa(`${environment.user}:${environment.password}}`)
                }
            })


        /*this.auth.currentAuthValue.esolToken
            ? request = request.clone({
                params:  request.params.delete('mocked').delete('auth'),
                setHeaders: {
                    Authorization: 'Bearer ' + ( !authType || authType === 'caas' ? this.auth.currentAuthValue.esolToken['access_token'] : null)
                }
            })
            : request = request.clone({ params:  request.params.delete('mocked').delete('auth') })*/

        return next
            .handle(request);
    }

}