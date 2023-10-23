import { Injectable } from '@angular/core';
import { AppConfigService } from './app.config.service';
import { App, OrderingExtra, OrderingExtraItem } from '../models/App.model';


@Injectable()
export class VersionService {

	constructor(private config: AppConfigService) { }

	getConfig(): any {
		return  Object.assign({}, this.config);
	}
	getGestor(): any {
		return  this.config.gestor;
	}
	getVersion(): string {
		return this.config.version;
	}
	getActive(): boolean {
		return this.config.active;
	}
	getVisibleResponsive(): boolean {
		return this.config.visible_responsive;
	}
	getAddToCartID(): number {
		return this.config.addToCartId;
	}
	getOrderingSpinner(): string {
		return this.config.ordering_spinner;
	}
	getOrderingExtra(): OrderingExtra {
		return this.config.ordering_extra;
	}
}