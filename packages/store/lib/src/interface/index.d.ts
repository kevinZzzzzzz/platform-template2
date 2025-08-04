import type { SizeType } from "antd/lib/config-provider/SizeContext";
export interface ThemeConfigProp {
    primary: string;
    isDark: boolean;
    weakOrGray: string;
}
export interface GlobalState {
    token: string;
    userInfo: any;
    assemblySize: SizeType;
    language: string;
    themeConfig: ThemeConfigProp;
}
export interface MenuState {
    isCollapse: boolean;
    menuList: Menu.MenuOptions[];
}
export interface TabsState {
    tabsActive: string;
    tabsList: Menu.MenuOptions[];
}
export interface BreadcrumbState {
    breadcrumbList: {
        [propName: string]: any;
    };
}
export interface AuthState {
    authButtons: {
        [propName: string]: any;
    };
    authRouter: string[];
    loginInfo: {
        [propName: string]: any;
    };
    token: string;
    appData: {
        [propName: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map