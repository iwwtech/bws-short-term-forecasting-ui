import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { format } from "date-fns";

const apiUrl = process.env.REACT_APP_API_URL;

export const createForecastModel = createAsyncThunk(
  "forecast/getForecastModel",
  async (initialPost, { rejectWithValue }) => {
    const [meterId, algorithm, date] = initialPost;

    const formatedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      const response = await axios.get(
        `${apiUrl}/meters/${meterId}/forecast?algorithm=${algorithm}&date=${formatedDate}`,
        initialPost
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const forecastSlice = createSlice({
  name: "forecast",
  initialState: {
    forecastData: null,
    usedAlgorithm: null,
    usedMeter: null,
    date: null,
    status: "idle",
    error: null,
    fulfilled: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createForecastModel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createForecastModel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.forecastData = action.payload;
        [state.usedMeter, state.usedAlgorithm] = action.meta.arg;
        // Date needs to be a string to be serializable
        state.date = format(action.meta.arg[2], "yyyy-MM-dd").toString();
        state.fulfilled = "Forecast successfully created.";
        state.error = null;
      })
      .addCase(createForecastModel.rejected, (state, action) => {
        state.status = "failed";
        state.fulfilled = null;
        state.error = action.payload?.msg;
      });
  },
});

export default forecastSlice.reducer;
