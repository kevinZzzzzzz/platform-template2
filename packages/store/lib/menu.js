import { c as createSlice } from './redux-toolkit.esm-ca140e18.js';

var _a;
var menuState = {
    isCollapse: false,
    menuList: []
};
var menuSlice = createSlice({
    name: "menu",
    initialState: menuState,
    reducers: {
        updateCollapse: function (state, _a) {
            var payload = _a.payload;
            state.isCollapse = payload;
        },
        // @ts-ignore
        setMenuList: function (state, _a) {
            var payload = _a.payload;
            state.menuList = payload;
        }
    }
});
var menu = menuSlice.reducer;
var updateCollapse = (_a = menuSlice.actions, _a.updateCollapse), setMenuList = _a.setMenuList;

export { menu as default, setMenuList, updateCollapse };
