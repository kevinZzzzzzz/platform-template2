import { MenuState } from "@/store/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const menuState: MenuState = {
	isCollapse: false,
	menuList: []
};

const menuSlice = createSlice({
	name: "menu",
	initialState: menuState,
	reducers: {
		updateCollapse(state: MenuState, { payload }: PayloadAction<boolean>) {
			state.isCollapse = payload;
		},
    // @ts-ignore
		setMenuList(state: MenuState, { payload }: PayloadAction<Menu.MenuOptions[]>) {
			state.menuList = payload;
		}
	}
});

export default menuSlice.reducer;
export const { updateCollapse, setMenuList } = menuSlice.actions;
