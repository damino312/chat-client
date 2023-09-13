import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: true,
  user: null,
  error: null,
};

// generates pending, fulfilled and rejected action type
export const fetchUser = createAsyncThunk("user/fetchUser", () => {
  return axios.get("/user").then((response) => response.data);
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = true;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;
