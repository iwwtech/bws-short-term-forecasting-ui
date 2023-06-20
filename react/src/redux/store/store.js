import { configureStore } from "@reduxjs/toolkit";
import meterReducer from "redux/slices/meterSlice";
import modelReducer from "redux/slices/modelSlice";
import forecastReducer from "redux/slices/forecastSlice";
import algorithmReducer from "redux/slices/algorithmSlice";

export default configureStore({
  reducer: {
    meter: meterReducer,
    model: modelReducer,
    algorithm: algorithmReducer,
    forecast: forecastReducer,
  },
});
