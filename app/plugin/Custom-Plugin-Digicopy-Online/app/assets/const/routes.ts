export interface Route {
    [key: string]: any;
    environment: string;
    auth: string | number | boolean;
    responsability: string;
    module: string;
    path: string;
    method?: string;
    pathMocked?: string | null;
    remote?: boolean;
    mocked?: boolean;
    unMockedGlobal?: boolean;
    extra?: {//for multiple uses with different flags
        mocks: RouteExtraMocks;
    } | null;
}
export interface RouteExtraMocks {
    [key: string]: {
        pathMocked: string | undefined;
        mocked: boolean | null | undefined;
    } | null | undefined;
}
export interface Routes {
    [key: string]: Route;
}
export const Routes: Routes = {
    getConfig: {
        environment: '',
        auth: 'caas',
        responsability: 'cpdo',
        module: '',
        method: 'get',
        path: 'config',
        pathMocked: 'config',
        remote: true,
        mocked: false,
        unMockedGlobal: true
    },
    uploadFile: {
        environment: '',
        auth: 'caas',
        responsability: 'cpdo',
        module: '',
        method: 'post',
        path: 'upload',
        pathMocked: '',
        remote: true,
        mocked: false,
        unMockedGlobal: true
    },
    createPost: {
        environment: '',
        auth: 'caas',
        responsability: 'wpApi',
        module: '',
        method: 'post',
        path: 'posts',
        pathMocked: 'config',
        remote: true,
        mocked: false,
        unMockedGlobal: true
    },
    addToCart: {
        environment: '',
        auth: 'caas',
        responsability: 'cpdo',
        module: '',
        method: 'post',
        path: 'budget',
        pathMocked: 'budget',
        remote: true,
        mocked: false,
        unMockedGlobal: true
    }
};