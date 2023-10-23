export interface App {
    [key: string]: any;
    token?: Token;
    id: number;
    styling?: any;
    links?: Link[];
    active?: boolean;
    spinner?: boolean;
    ordering?: boolean;
    ordering_spinner?: string;
    ordering_action?: string;
    ordering_message?: string;
    ordering_percentage?: number;
    ordering_extra?: OrderingExtra;
    visible_responsive?: boolean;
    gestor_position?: string;
    gestor_hidden?: boolean;
    addToCartId?: number;
    gestor: Gestor;
    gestorFocusedId?: number;
    groups: Group[];
    content?: string;
    contentClassName?: string;
    contentClear?: string;
    contentClearClassName?: string;
    contentOption?: ItemOptionGestor;
    icons?: Icon[];
    configToStart?: string;
    configs?: AppConfig[];
    configFocused?: string | null;
    coreGestorPersistance?: Gestor;
}
export interface Token {
    [key: string]: any;
    value?: string;
    decoded?: any;
}
export interface Gestor {
    [key: string]: any;
    active?: boolean;
    visible_responsive: boolean;
    options: ItemGestor[];
}
export interface ItemGestor {
    [key: string]: any;
    type?: string;
    rot: RotGestor;
    style: ItemRotStyleGestor;
    orientation?: string;//horizontal|vertical
    perRow?: number;
    info?: ItemInfoGestor;
    options?: ItemOptionGestor[];
    value?: any;
}
export interface RotGestor {
    [key: string]: any;
    text: string;
    style: ItemRotStyleGestor;
    ["property-value"]?: string;
}
export interface IconGestor {
    [key: string]: any;
    style: ItemIconStyleGestor;
}
export interface ItemRotStyleGestor {
    [key: string]: any;
    "font-size": string;
    "font-color"?: string;
}
export interface ItemIconStyleGestor {
    [key: string]: any;
}
export interface ItemInfoGestor {
    [key: string]: any;
    visible: boolean;
    content: string;
}
export interface ItemOptionGestor {
    [key: string]: any;
    type?: string;
    rot: RotGestor;
    icon?: IconGestor;
    className?: string;
    perPage?: boolean;
    unique?: boolean;
    cost?: number;
    selected?: boolean;
    page?: Page;
    close?: Close;
}
export interface Page {
    [key: string]: any;
    id?: string;
    active?: boolean;
    content?: string;
    className?: string;
    contentClear?: string;
    contentClearClassName?: string;
}
export interface Close {
    [key: string]: any;
    id?: string;
    active?: boolean;
    content?: string;
    className?: string;
}
export interface Group {
    [key: string]: any;
    id: number;
    index: number;
    selected: boolean;
    gestor: Gestor;
    ammount?: number;
    files: FileItem[];
    listView?: boolean;
    error?: ErrorGroupItem[];
    authomatic?: string;
    ungrouped?: boolean;
}
export interface FileItem {
    [key: string]: any;
    file: File;
    id: number;
    index: number;
    selected?: boolean;
    info: FileItemInfo;
    name: string;
    numPages?: number;
    finalNumPages?: number;
    finalSheets?: number;
    uploaded?: boolean;
    upload_status?: boolean;
    upload_result?: any;
    thumbnails?: ThumbnailItem[];
    finalThumbnails?: ThumbnailItem[];
    config?: FileItemConfig;
    authomatic?: string;
}
export interface FileItemConfig {
    [key: string]: any;
    perPage: number;
    verticalAlign: string;
    rotation: number;
    pageDirection: string;
    doubleFace?: boolean;
    doubleFaceDirection?: boolean;
}
export interface ThumbnailItem {
    [key: string]: any;
    page: number;
    url: any;
    deleted?: boolean;
    color?: boolean;
    focused?: boolean;
    hidden?: boolean;
}
export interface FileItemInfo {
    [key: string]: any;
    name: string;
    size: number;
    measure: String//Kb,Mb
    totalBytes: number;
}
export interface Orders {
    [key: string]: any;
    id: number;
    orders: Order[];
}
export interface Order {
    [key: string]: any;
    title: string;
    ammount: number;
    properties: OrderProperty[];
    files: OrderFile[];
}
export interface OrderProperty {
    [key: string]: any;
    title: string;
    value: string | number;
}
export interface OrderFile {
    [key: string]: any;
    url: string;
    name: string;
    properties: { [key: string]: any; }[];
    cost: number;
}
export interface OrderingExtra {
    [key: string]: any;
    collection?: OrderingExtraItem[];
}
export interface OrderingExtraItem {
    [key: string]: any;
    id: string;
    selected?: boolean;
    code?: string;
}

export interface ErrorGroupItem {
    [key: string]: any;
    id: string;
    html: string;
}

export interface Icon {
    [key: string]: any;
    id?: String;
    active?: boolean;
    content?: IconContent;
}
export interface IconContent {
    [key: string]: any;
    innerHTML?: string;
    className?: string;
    style?: string;
}
export interface AppConfig {
    [key: string]: any;
    id?: string;
    gestor?: Gestor,
}
export interface Link{
    [key: string]: any;
    id?:string;
    active?:boolean;
    href?:string;
    rel?:string;
}