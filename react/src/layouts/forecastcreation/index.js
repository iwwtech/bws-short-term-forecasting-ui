/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import LayoutCard from "components/Cards/BlogCards/LayoutCard";
import MDTypography from "components/MDTypography";
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import MDButton from "components/MDButton";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllMeters } from "redux/slices/meterSlice";
import { fetchAllAlgorithms } from "redux/slices/algorithmSlice";
import { createForecastModel } from "redux/slices/forecastSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import ForecastChart from "./components/ForecastChart";
import CsvExportDataGrid from "./components/CsvExportDataGrid";

function ForecastCreation() {
  const dispatch = useDispatch();

  const [selectedMeter, setSelectedMeter] = useState();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const forecast = useSelector((state) => state.forecast);
  const forecastError = useSelector((state) => state.forecast.error);
  const forecastFulfilled = useSelector((state) => state.forecast.fulfilled);
  const meters = useSelector((state) => state.meter.meters);
  const meterStatus = useSelector((state) => state.meter.status);
  const algorithms = useSelector((state) => state.algorithm.algorithms);
  const algorithmStatus = useSelector((state) => state.algorithm.status);

  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const canCreateForecast = addRequestStatus === "idle";
  const [openLoading, setOpenLoading] = useState(false);
  const requiredFieldsForButton = Boolean(selectedAlgorithm && selectedMeter);

  const onChangeMeter = (event) => {
    setSelectedMeter(event.target.value);
  };

  const onChangeAlgorithm = (event) => {
    const selectedValue = event.target.value;
    setSelectedAlgorithm(selectedValue);
  };

  // Create Forecast and wait until process ends
  const onClickCreateForecast = async () => {
    if (canCreateForecast) {
      try {
        setAddRequestStatus("pending");
        setOpenLoading(true);
        await dispatch(createForecastModel([selectedMeter, selectedAlgorithm, selectedDate]));
      } catch (err) {
        console.error("Failed to create Forecast", err);
      } finally {
        setAddRequestStatus("idle");
        setOpenLoading(false);
      }
    }
  };

  // Load meters and algorithms
  useEffect(() => {
    if (meterStatus === "idle") {
      dispatch(fetchAllMeters());
    }
  }, [meterStatus, dispatch]);

  useEffect(() => {
    if (algorithmStatus === "idle") {
      dispatch(fetchAllAlgorithms(false));
    }
  }, [algorithmStatus, dispatch]);

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <MDBox>
              <LayoutCard
                title="Forecast Creation"
                description="Here you can select a meter, i. e. a household or an aggregation of households, to
                  create a forecast for. If you cannot find the desired meter, you can add it in the
                  Meter Managment tab. If there is no model to generate with, 
                  you can create it in the Model Managment tab."
              >
                {forecastError !== null ? <Alert severity="error">{forecastError}</Alert> : null}
                {forecastFulfilled !== null ? (
                  <Alert severity="success">{forecastFulfilled}</Alert>
                ) : null}

                <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={openLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>

                <Grid container spacing={3}>
                  <Grid item xs={6} md={6} lg={6}>
                    <MDTypography variant="h6" color="text">
                      Forecast Meter:
                    </MDTypography>

                    <Box>
                      <FormControl fullWidth>
                        <Select
                          value={selectedMeter || ""}
                          defaultValue=""
                          onChange={onChangeMeter}
                          sx={{ minHeight: 40 }}
                        >
                          {meters.map((option) => (
                            <MenuItem sx={{ minHeight: 40 }} key={option.id} value={option.id}>
                              {option.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={6} lg={6}>
                    <Grid item xs={12}>
                      <MDTypography variant="h6" color="text">
                        Forecast Algorithm:
                      </MDTypography>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <Select
                            value={selectedAlgorithm || ""}
                            defaultValue=""
                            onChange={onChangeAlgorithm}
                            sx={{ minHeight: 40 }}
                          >
                            {algorithms.map((algo) => (
                              <MenuItem key={algo.name} value={algo.name}>
                                {algo.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid>
                      <MDTypography variant="h6" color="text">
                        Forecast date:
                      </MDTypography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>

                  <Grid item xs={6} md={6} lg={6}>
                    <MDButton
                      color="info"
                      onClick={onClickCreateForecast}
                      disabled={!requiredFieldsForButton}
                    >
                      Create Forecast
                    </MDButton>
                  </Grid>
                </Grid>
              </LayoutCard>
            </MDBox>
          </Grid>
          {forecast.forecastData !== null ? (
            <Grid item xs={12} md={12} lg={12}>
              <LayoutCard
                title="Forecast Data"
                description={
                  <>
                    This forecast is generated for <strong>{forecast.date}</strong> using meter
                    &quot;
                    {forecast.usedMeter}&quot; and algorithm &quot;{forecast.usedAlgorithm}&quot;.
                  </>
                }
              >
                <Grid item xs={12} md={12} lg={12}>
                  <ForecastChart data={forecast.forecastData} />
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <CsvExportDataGrid data={forecast.forecastData} />
                </Grid>
              </LayoutCard>
            </Grid>
          ) : null}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ForecastCreation;
