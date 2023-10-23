import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Spinner } from '../models/Spinner.model';


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinner: Spinner = {
    Visible: false,
    Components: {
      GetConfig: false,
      UploadFile: false,
      CreatePost: false,
      AddToCart: false
    }
  };

  public _spinner$Subject: BehaviorSubject<Spinner>;

  constructor() {
    this._spinner$Subject = new BehaviorSubject<Spinner>(this.spinner);
  }

  public get status(): Spinner {
    return this._spinner$Subject.value;
  }
  public setData(_param: string, _value: any) {
    this.status[_param] = _value;
    this._spinner$Subject.next(this.status);
  }
  public setComponentStatus(_param: string, _value: any) {
    this.status.Components[_param] = _value;
    this._spinner$Subject.next(this.status);
  }

}

