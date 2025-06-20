// import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";
import { store } from "@/store";
import { setSysCompanyName } from "@repo/store/dist/global";
// import { routerArray } from "@/router";
// import { isFederateModule } from "@/utils/is";

// 标准版模块
let standardRouter: Array<RouteObject> = []
if (import.meta.env.VITE_CUSTOM === 'standard') {
  try {
    const standardRouters: any = await import('remote_standard/standardRouter')
    store.dispatch(setSysCompanyName('标准版'))
    standardRouter = [
      {
        path: "/standard",
        // element: <DefaultLayout children={''} routerArray={routerArray} />,
        children: standardRouters.standardRouter.map((item: RouteObject) => {
          return {
            ...item,
            path: item.path,
            // element: lazyLoad(lazy(() => import(`remote_standard${item.path}`)))
          };
        })
      }
    ];
  } catch (error) {
    console.error('error',error)
  }
}


export default standardRouter;
