import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  user: false,
  error: false,
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
      state.loading = false;
      state.user = false;
      state.error = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = false;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.user = false;
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;
