import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Success } from '../models/Success.model';


@Injectable({
  providedIn: 'root'
})
export class SuccessService {

  success: Success = {};

  //success
  public currentSuccessSubject: BehaviorSubject<Success>;
  public currentSuccess: Observable<Success>;

  constructor() {
    this.currentSuccessSubject = new BehaviorSubject<Success>(this.success)
    this.currentSuccess = this.currentSuccessSubject.asObservable();
  }

  public get currentSuccessValue(): Success {
    return this.currentSuccessSubject.value;
  }

  public setCurrentSuccessValue(_param: string, _value: any) {
    this.currentSuccessValue[_param] = _value;
    this.currentSuccessSubject.next(this.currentSuccessValue);
  }
}
