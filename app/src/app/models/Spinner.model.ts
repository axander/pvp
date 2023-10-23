export interface Spinner {
    [key: string]:any;
    Visible: Boolean;
    Components: SpinnerComponents;
}
export interface SpinnerComponents{
    [key: string]:any;
    AddToCart: boolean;
}