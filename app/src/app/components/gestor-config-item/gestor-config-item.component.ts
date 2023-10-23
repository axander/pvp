import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig, Gestor, Group, ItemGestor, ItemInfoGestor, ItemOptionGestor, RotGestor } from 'src/app/models/App.model';
import { Config } from 'src/app/models/Config.model';
import { AppService } from 'src/app/services/app.service';
import { Rules } from 'src/app/utils/rules';

@Component({
  selector: 'app-gestor-config-item',
  templateUrl: './gestor-config-item.component.html',
  styleUrls: ['./gestor-config-item.component.scss']
})
export class GestorConfigItemComponent implements OnInit {

  @Input('data')
  data$!: ItemGestor;

  visibleInfo!: boolean;
  contentInfo!: string;
  appLstnr: Subscription = new Subscription;

  infoStyle!: string;
  infoStyleOpen!: string;
  modalStyle!: string;
  modalStyleOpen!: any;

  selectedItem!: ItemOptionGestor;

  constructor(
    public appSvc: AppService
  ) { }
  ngOnInit() {
    this.appLstnr = this.appSvc.currentAppSubject.subscribe(data => {

      try {
        this.infoStyle = data['info_modal']['info']['style'];
        this.infoStyleOpen = data['info_modal']['info_open']['style'];
        this.modalStyle = data['info_modal']['modal']['style'];
        this.modalStyleOpen = data['info_modal']['modal_open']['style'];
      } catch (e) {

      }
    });
  }
  ngOnDestroy() {
    this.appLstnr.unsubscribe();
  }
  select(item: ItemOptionGestor) {
    if (item['close_config']) {
      this.appSvc.setAnyParam('visible_responsive', false);
    }
    if (item['set_config']) {
      item.selected = false;
      this.appSvc.currentAppValue.contentOption ? this.appSvc.currentAppValue.contentOption!.selected = false : null;
      this.appSvc.setAnyParam('content', null);
      if (item['set_config'] == 'core') {
        this.appSvc.setCoreConfig();
      } else {
        let config: AppConfig = this.appSvc.currentAppValue.configs!.find((x: AppConfig) => x['id'] == item['set_config'])!;
        this.appSvc.setGestorConfig(item['set_config'], config.gestor!);
      }

    } else {
      this.appSvc.currentAppValue.content
        ? (
          this.appSvc.currentAppValue.contentOption!.selected = false,
          this.appSvc.setAnyParam('content', null)
        )
        : null;
      if (item.page && item.page.active) {
        this.appSvc.setAnyParam('content', item.page.content);
        this.appSvc.setAnyParam('contentClassName', item.page.className);
        this.appSvc.setAnyParam('contentClear', item.close?.content);
        this.appSvc.setAnyParam('contentClearClassName', item.close?.className);
        this.appSvc.setAnyParam('contentOption', item);
      }
      this.unsetRelatedSection(this.data$.options?.find((x: ItemOptionGestor) => x.selected)!);
      this.setRelatedSection(item);
      this.unsetRelatedExtra(this.data$.options?.find((x: ItemOptionGestor) => x.selected)!);
      this.setRelatedExtra(item);
      this.data$.options?.find(x => {
        x.rot != item.rot ? x.selected = false : null;
      })
      this.selectedItem = this.data$.options?.find(x => x.selected)!;
      if (!this.selectedItem || (this.selectedItem && this.selectedItem != item)) {
        this.selectedItem = item;
        item.selected = !item.selected;
        this.appSvc.selectedOption(item);
      };
      item["message"] && item["message"]["active"]
        ? (
          this.contentInfo = item["message"]["content"],
          this.toogleInfo()
        )
        : null;
    }
  }
  ruleChecked(item: ItemOptionGestor) {
    console.log(this.data$.options);
    console.log(this.data$.options?.find((x: ItemOptionGestor) => x.selected));

  }
  showInfo(_info: ItemInfoGestor) {
    this.contentInfo = _info.content;
    this.toogleInfo();
  }
  toogleInfo() {
    this.visibleInfo = !this.visibleInfo;
  }
  unsetRelatedSection(item: ItemOptionGestor) {
    let match!: ItemOptionGestor;
    item ? ['related-section']
      ? (
        match = this.appSvc.currentAppValue.gestor.options.find(x => x['id'] == item['related-section'])!,
        match
          ? (
            match['active'] = false,
            this.appSvc.update()
          )
          : null
      )
      : null
      : null
  }
  setRelatedSection(item: ItemOptionGestor) {
    let match!: ItemOptionGestor;
    item['related-section']
      ? (
        match = this.appSvc.currentAppValue.gestor.options.find(x => x['id'] == item['related-section'])!,
        console.log(match),
        match
          ? (
            match['active'] = true,
            this.appSvc.update()
          )
          : null
      )
      : null;
  }
  setRelatedExtra(item: ItemOptionGestor) {
    let match!: ItemGestor;
    let matchIds: string[] = [];
    item['related-extra']?.map((x: ItemGestor) => {
      match = this.appSvc.currentAppValue.gestor.options.find((y: ItemGestor) => y['id'] == x['id'])!;
      if (match) {
        if (!x.options) {
          match['active'] = false;
        } else {
          match['active'] = true;
          x.options.map(y => matchIds.push(y['id']));
          if (!x.options.length) {
            match.options!.map((z: ItemOptionGestor) => z['active'] = true);
          } else {
            match.options!.map((z: ItemOptionGestor) => matchIds.includes(z['id']) ? z['active'] = true : z['active'] = false);
          }
        }
        this.appSvc.update()
      }
    })
  }
  unsetRelatedExtra(item: ItemOptionGestor) {
    let match!: ItemOptionGestor;
    if (item) {
      item['related-extra']?.map((x: ItemOptionGestor) => {
        match = this.appSvc.currentAppValue.gestor.options.find((y: ItemOptionGestor) => y['id'] == x['id'])!;
        match
          ? (
            match['active'] = false,
            this.appSvc.update()
          )
          : null
      })
    }
  }
}
