import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
// import global from "./modules/global";
// import menu from "./modules/menu";
// import tabs from "./modules/tabs";
// import auth from "./modules/auth";
// import breadcrumb from "./modules/breadcrumb";
import global from "@repo/store/lib/global";
import menu from "@repo/store/lib/menu";
import tabs from "@repo/store/lib/tabs";
import auth from "@repo/store/lib/auth";
import breadcrumb from "@repo/store/lib/breadcrumb";

// create reducer
const reducer = combineReducers({
	global,
	menu,
	tabs,
	auth,
	breadcrumb
});

// redux persist
const persistConfig = {
	key: "redux-state",
	storage: storage
};
const persistReducerConfig = persistReducer(persistConfig, reducer);
export const store = configureStore({
	reducer: persistReducerConfig,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // 关闭序列化检查
    }),
	devTools: true
})
// create persist store
export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
