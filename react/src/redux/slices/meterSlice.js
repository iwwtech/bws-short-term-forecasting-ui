import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Thunks auslagern in eigene Datei, wenn zu viel
export const fetchPhysicalMeters = createAsyncThunk("meters/fetchPhysicalMeters", async () => {
  const response = await axios.get(`${apiUrl}/physical-meters`);
  return response.data;
});

export const fetchVirtualMeters = createAsyncThunk("meters/fetchVirtualMeters", async () => {
  const response = await axios.get(`${apiUrl}/virtual-meters`);
  return response.data;
});

export const fetchAllMeters = createAsyncThunk("meters/fetchAllMeters", async () => {
  const requestOne = await axios.get(`${apiUrl}/physical-meters`);
  const requestTwo = await axios.get(`${apiUrl}/virtual-meters`);

  const responses = await axios.all([requestOne, requestTwo]);

  const data = [];
  data.push(responses[0].data);
  data.push(responses[1].data);

  return data;
});

export const postVirtualMeter = createAsyncThunk(
  "meters/postVirtualMeters",
  async (initialState, { rejectWithValue }) => {
    const [meters, name] = initialState;
    const payload = { submeterIds: [] };

    meters.forEach((submeter) => {
      payload.submeterIds.push(submeter.id);
    });

    try {
      let url = `${apiUrl}/virtual-meters`;
      if (name.toString() !== "") {
        const formattedName = name.toString().replace(/ /g, "_");
        url += `?name=${formattedName}`;
      }
      const response = await axios.post(url, payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteVirtualMeter = createAsyncThunk(
  "meters/deleteVirtualMeters",
  async (initialState, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${apiUrl}/virtual-meters/${initialState}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const meterSlice = createSlice({
  name: "meter",
  initialState: {
    meters: [],
    status: "idle",
    fulfilled: null,
    error: null,
  },
  reducer: {},

  extraReducers(builder) {
    builder
      .addCase(fetchPhysicalMeters.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPhysicalMeters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meters = state.meters.concat(action.payload.meters);
        state.error = null;
        state.fulfilled = null;
      })
      .addCase(fetchPhysicalMeters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.fulfilled = null;
      })
      .addCase(fetchVirtualMeters.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchVirtualMeters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meters = state.meters.concat(action.payload.meters);
        state.error = null;
        state.fulfilled = null;
      })
      .addCase(fetchVirtualMeters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.fulfilled = null;
      })
      .addCase(fetchAllMeters.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllMeters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meters = state.meters.concat(action.payload[0].meters);
        state.meters = state.meters.concat(action.payload[1].virtualMeters);
        state.error = null;
        state.fulfilled = null;
      })
      .addCase(fetchAllMeters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.fulfilled = null;
      })
      .addCase(postVirtualMeter.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(postVirtualMeter.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newMeter = {
          id: action.payload.virtualMeterId,
          submeterIds: [],
          supermeterIds: [],
        };

        action.meta.arg.forEach((virtualMeter) => {
          newMeter.submeterIds.push(virtualMeter.id);
        });

        state.meters = state.meters.concat(newMeter);
        state.error = null;
        state.fulfilled = `Meter ${newMeter.id} successfully created.`;
      })
      .addCase(postVirtualMeter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.msg;
        state.fulfilled = null;
      })
      .addCase(deleteVirtualMeter.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteVirtualMeter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meters = state.meters.filter((meter) => meter.id !== action.meta.arg);
        state.error = null;
        state.fulfilled = `Meter ${action.meta.arg} successfully deleted.`;
      })
      .addCase(deleteVirtualMeter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.msg;
        state.fulfilled = null;
      });
  },
});

export default meterSlice.reducer;
