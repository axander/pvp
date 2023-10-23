import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from '../models/Auth.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    sneak!: string | null;
    subLoginUserToken!: Subscription;

    // crossChecked: boolean = false;
    public currentAuthSubject: BehaviorSubject<Auth>;
    public currentAuth: Observable<Auth>;
    private auth: Auth = {
        esolToken: null,
        spinnerCtrl: { every: false },
        error: false,
        authorized: false
    }

    constructor(
        private router: Router,
        public helper: JwtHelperService,
        private http: HttpClient
    ) {
        this.sneak = localStorage.getItem('sneak');
        helper = new JwtHelperService();
        this.currentAuthSubject = new BehaviorSubject<Auth>(this.auth);
        this.currentAuth = this.currentAuthSubject.asObservable();        
    }
    public get currentAuthValue(): Auth {
        return this.currentAuthSubject.value;
    }

    public setCurrentAuthValue(_param: string, _value: any) {
        this.currentAuthValue[_param] = _value;
        this.currentAuthSubject.next(this.currentAuthValue);
    }

    public async getToken(): Promise<any | undefined[]> {
        const esolTokenPromise = new Promise(async (resolve, reject) => {
        })
        return Promise.all([esolTokenPromise, null, null]);
    }
} 
