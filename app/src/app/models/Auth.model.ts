export interface Auth {
    [key: string]:any;
    esolToken:AccessToken | null;
    mocked?:boolean | null;
    spinnerCtrl:SpinnerCtrl;
    error:Boolean;
    authorized:Boolean;
    
}
export interface AccessToken {
    access_token:string;
    refresh_token:string;
    refresh_token_expiration:Number;
}
export interface SpinnerCtrl{
    every:Boolean;
    hideBg?:boolean;
    negative?:boolean;
}