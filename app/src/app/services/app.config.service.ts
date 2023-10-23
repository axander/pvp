import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { App, OrderingExtra } from '../models/App.model';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private http: HttpClient) { }

  public active!: boolean;
  public visible_responsive!: boolean;
  public gestor!: App;
  public version!: string;
  public addToCartId!: number;
  public ordering_spinner!: string;
  public ordering_extra!: OrderingExtra;

  load(): Promise<any> {
    let root = localStorage.getItem("root");
    //https://digicopy.com.es/wp-json/cpdo/v1/config
    //const promise = this.http.get(environment.api.config + 'app.config.json?date='+new Date().getTime())
    const promise = this.http.get((root ? root: "") + environment.api.config + '?date=' + new Date().getTime())
      .toPromise()
      .then(data => {
        Object.assign(this, data);
        return data;
      });

    return promise;
  }
}