// import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";
import { store } from "@/store";
import { setSysCompanyName } from "@/store/modules/global";
// import { routerArray } from "@/router";
// import { isFederateModule } from "@/utils/is";

// 标准版模块
let chongqingRouter: Array<RouteObject> = []
if (import.meta.env.VITE_CUSTOM === 'chongqing') {
  try {
    // @ts-ignore
    let chongqingRouters: any  = await import('remote_chongqing/chongqingRouter')
    store.dispatch(setSysCompanyName('重庆版'))
    chongqingRouter = [
      {
        path: "/chongqing",
        // element: <DefaultLayout children={''} routerArray={routerArray} />,
        children: chongqingRouters.chongqingRouter.map((item: RouteObject) => {
          return {
            ...item,
            path: item.path,
            // element: lazyLoad(lazy(() => import(`remote_chongqing${item.path}`)))
          };
        })
      }
    ];
  } catch (error) {
    console.error('error',error)
  }
}


export default chongqingRouter;
