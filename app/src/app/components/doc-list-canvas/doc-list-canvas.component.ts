import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileItem } from 'src/app/models/App.model';
import { BehaviorSubject, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doc-list-canvas',
  templateUrl: './doc-list-canvas.component.html',
  styleUrls: ['./doc-list-canvas.component.scss']
})
export class DocListCanvasComponent implements OnInit {

  @Output('callbackDelete') callbackDelete: EventEmitter<FileItem> = new EventEmitter();

  @Input("files") files$!: FileItem[];
  @Input("positions") positions$!: { id: number, order: number }[];
  @Input("mode") mode!: string;

  private _unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<any> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(

  ) { }
  ngOnInit() {

    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
        takeUntil(this._unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
        this._setMediaBreakpoint(evt.target.innerWidth);
      });
  }
  ngOnDestroy() {
    //this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }
  private _setMediaBreakpoint(width: number): void {
    if (width < 576) {
      this.mediaBreakpoint$.next('xs');
    } else if (width >= 576 && width < 768) {
      this.mediaBreakpoint$.next('sm');
    } else if (width >= 768 && width < 992) {
      this.mediaBreakpoint$.next('md');
    } else if (width >= 992 && width < 1200) {
      this.mediaBreakpoint$.next('lg');
    } else if (width >= 1200 && width < 1600) {
      this.mediaBreakpoint$.next('xl');
    } else {
      this.mediaBreakpoint$.next('xxl');
    }
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }
  getPosition(file: FileItem, mode: string) {
    switch (mode) {
      case 'edit':
        return (file.index - 1) * ( this.mediaBreakpoint$.value == 'xs' || this.mediaBreakpoint$.value == 'sm' ? 73 : 81)
      default:
        return (file.index - 1) * 101.6
    }
  }
  deleteFile(file: FileItem) {
    //this.callbackDelete.emit(file);
  }
}
