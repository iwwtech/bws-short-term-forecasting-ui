import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchAllModels = createAsyncThunk("model/fetchAllModels", async () => {
  const response = await axios.get(`${apiUrl}/models`);
  return response.data;
});

export const createModel = createAsyncThunk(
  "model/createModel",
  async (initialPost, { rejectWithValue }) => {
    const [meterId, algorithm, parameterOptimization, hpoLoopCount, paramValues, comment] =
      initialPost;

    // Create payload for custom user values
    const payload = { hyperparameters: {} };
    if (!parameterOptimization) {
      paramValues.forEach((params) => {
        payload.hyperparameters[params.paramName] = params.paramValue;
      });
    }

    try {
      const response = await axios.put(
        `${apiUrl}/meters/${meterId}/models/${algorithm}?hyperParamSearch=${parameterOptimization}&numConfigurations=${hpoLoopCount}&comment=${comment}`,
        payload
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

export const deleteModelByID = createAsyncThunk("model/deleteModelByID", async (initialPost) => {
  const modelId = initialPost;
  const response = await axios.delete(`${apiUrl}/models/${modelId}`);
  return response.data;
});

export const modelSlice = createSlice({
  name: "model",
  initialState: {
    models: [],
    status: "idle",
    fulfilled: null,
    error: null,
  },
  reducer: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllModels.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAllModels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.models = state.models.concat(action.payload.MLModels);
      })
      .addCase(fetchAllModels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createModel.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createModel.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Update or create model
        const currentModel = state.models.find((model) => model.id === action.payload.modelId);
        if (!currentModel) {
          const newModel = {
            id: action.payload.modelId,
            algorithm: action.meta.arg[1],
            evaluation: {
              metrics: action.payload.metrics,
              actualTestConsumption: action.payload.actualTestConsumption,
              predictedTestConsumption: action.payload.predictedTestConsumption,
              testTimestamps: action.payload.testTimestamps,
            },
          };
          state.models = state.models.concat(newModel);
          state.fulfilled = `Model ${newModel.id} successfully created.`;
        } else {
          state.fulfilled = `Model ${action.payload.modelId} successfully updated.`;
        }

        state.error = null;
      })
      .addCase(createModel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.msg;
      })
      .addCase(deleteModelByID.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteModelByID.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.models = state.models.filter((model) => model.id !== action.meta.arg);
        state.error = null;
        state.fulfilled = `Model ${action.meta.arg} successfully deleted.`;
      })
      .addCase(deleteModelByID.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default modelSlice.reducer;
