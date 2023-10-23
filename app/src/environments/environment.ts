
export interface Environment {
  deploy: Boolean | null | undefined;
  assets_path: string;
  mocks: { path: string } | null | undefined;
  api: EnvironmentApi;
  user: string;
  password: string;
}
export interface EnvironmentApi {
  [key: string]: string;
  translations: string;
  config: string;
  local: string;
  wpApi: string;
  cpdo:string;
}

export const environment: Environment = {
  deploy: false,//determina si estamos desplegando en algún entorno, especialmente dirigido a enrutados de mocks...
  assets_path: "/wp-content/plugins/Custom-Plugin-Digicopy-Online/app/",
  mocks: {
    path: 'assets/mocks/'
  },
  api: {
    translations: "/assets/i18n/",
    config: "/wp-json/cpdo/v1/config",
    local: 'http://localhost:3000/',
    wpApi: "/wp-json/wp/v2/",
    cpdo:"/wp-json/cpdo/v1/"
  },
  user: "Alex",
  password: "S3Ll OHDk S0FA Gr42 kfcc vnPF"
}
