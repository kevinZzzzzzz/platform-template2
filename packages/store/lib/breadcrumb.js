import { c as createSlice } from './redux-toolkit.esm-ca140e18.js';

var breadcrumbState = {
    breadcrumbList: {}
};
var breadcrumbSlice = createSlice({
    name: "breadcrumb",
    initialState: breadcrumbState,
    reducers: {
        setBreadcrumbList: function (state, _a) {
            var payload = _a.payload;
            state.breadcrumbList = payload;
        }
    }
});
var setBreadcrumbList = breadcrumbSlice.actions.setBreadcrumbList;
var breadcrumb = breadcrumbSlice.reducer;

export { breadcrumb as default, setBreadcrumbList };
