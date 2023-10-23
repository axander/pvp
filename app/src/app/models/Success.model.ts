export interface Success {
    [key: string]:any;
    Visible?: Boolean;
    Components?: SuccessComponents;
}
export interface SuccessComponents{
    [key: string]:any;
    AddToCart: boolean;
}