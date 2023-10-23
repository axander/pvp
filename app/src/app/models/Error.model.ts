export interface Error {
    [key: string]: any;
    Visible: Boolean;
    Components: ErrorComponents;
}
export interface ErrorComponents {
    [key: string]: any;
    AddToCart: boolean;
}