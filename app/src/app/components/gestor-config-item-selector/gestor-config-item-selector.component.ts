import { Component, Input, OnInit } from '@angular/core';
import { ItemOptionGestor } from 'src/app/models/App.model';

@Component({
  selector: 'app-gestor-config-item-selector',
  templateUrl: './gestor-config-item-selector.component.html',
  styleUrls: ['./gestor-config-item-selector.component.scss']
})
export class GestorConfigItemSelectorComponent implements OnInit {

  @Input('data')
  data$!: ItemOptionGestor;
  @Input('perRow')
  perRow$!: number | undefined;
  widthPerCent!:number;
  constructor() { }
  ngOnInit() {
    if(this.perRow$){
      this.widthPerCent =100/ this.perRow$;
  }
   
  }
}