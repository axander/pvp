import { Injectable } from '@angular/core';
import { AppService } from './app.service';


@Injectable({
    providedIn: 'root',
})

export class PermissionsService {


    constructor(
        private appSvc: AppService
    ) {

    }

    public setPermission(_permission: string) {
        switch (_permission) {
            case 'S0001':
                if (this.appSvc.currentAppValue.token?.decoded['license']['value'] != 'standard') return true
                break;
            case 'S0002':
                if (this.appSvc.currentAppValue.token?.decoded['license']['value'] != 'standard') return true
                break;
            default:
                break;

        }
        return false
    }

}
