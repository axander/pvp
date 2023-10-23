import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Error } from '../models/Error.model'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  error: Error = {
    Visible: false,
    Components: {
      UploadFile: false,
      GetConfig: false,
      CreatePost: false,
      AddToCart: false
    }
  };

  public _error$Subject: BehaviorSubject<Error>;

  constructor() {
    this._error$Subject = new BehaviorSubject<Error>(this.error);
  }

  public get status(): Error {
    return this._error$Subject.value;
  }
  public setData(_param: string, _value: any) {
    this.status[_param] = _value;
    this._error$Subject.next(this.status);
  }
  public setComponentStatus(_param: string, _value: any) {
    this.status.Components[_param] = _value;
    this._error$Subject.next(this.status);
  }

}
