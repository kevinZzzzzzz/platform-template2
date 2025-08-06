import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: [],
  },
  reducers: {
    setMessage: (state, action: PayloadAction<any[]>) => {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = messageSlice.actions;
export default messageSlice.reducer;
