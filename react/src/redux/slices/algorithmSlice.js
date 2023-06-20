import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchAllAlgorithms = createAsyncThunk(
  "algorithm/fetchAllAlgorithms",
  async (WithParams = false) => {
    const response = await axios.get(`${apiUrl}/algorithms?includeParameters=${WithParams}`);
    return response.data;
  }
);

export const algorithmSlice = createSlice({
  name: "algorithm",
  initialState: {
    algorithms: [],
    status: "idle",
    error: null,
  },
  reducer: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllAlgorithms.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllAlgorithms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.algorithms = state.algorithms.concat(action.payload.algorithms);
      })
      .addCase(fetchAllAlgorithms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default algorithmSlice.reducer;
