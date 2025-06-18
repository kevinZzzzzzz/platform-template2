// import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";
// import { routerArray } from "@/router";
// import { isFederateModule } from "@/utils/is";

let standardRouters: any = {}
// 标准版模块
let standardRouter: Array<RouteObject> = []
if (import.meta.env.VITE_CUSTOM === 'standard') {
  try {
    standardRouters = await import('remote_standard/standardRouter')
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
    console.log('error',error)
  }
}


export default standardRouter;
