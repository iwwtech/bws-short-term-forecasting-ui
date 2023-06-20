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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";

import LayoutCard from "components/Cards/BlogCards/LayoutCard";
import MDTypography from "components/MDTypography";
import {
  Alert,
  Backdrop,
  CircularProgress,
  FormControl,
  Input,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";

import MDButton from "components/MDButton";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMeters } from "redux/slices/meterSlice";
import { fetchAllModels, createModel } from "redux/slices/modelSlice";
import { fetchAllAlgorithms } from "redux/slices/algorithmSlice";

import ParameterCard from "./components/ParameterCard";
import ModelTable from "./components/ModelTable";

function ModelManagment() {
  const [selectedMeter, setSelectedMeter] = useState();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState();
  const [selectedAlgoParams, setSelectedAlgoParams] = useState();
  const [paramValues, setParamValues] = useState([]);

  const dispatch = useDispatch();

  const meters = useSelector((state) => state.meter.meters);
  const meterStatus = useSelector((state) => state.meter.status);
  const models = useSelector((state) => state.model.models);
  const modelStatus = useSelector((state) => state.model.status);
  const algorithms = useSelector((state) => state.algorithm.algorithms);
  const algorithmStatus = useSelector((state) => state.algorithm.status);

  const modelError = useSelector((state) => state.model.error);
  const modelFulfilled = useSelector((state) => state.model.fulfilled);

  const [parameterOptimization, setParameterOptimization] = useState(true);
  const [modelComment, setModelComment] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const canCreateModel = addRequestStatus === "idle";

  const requiredFields = Boolean(selectedAlgorithm && selectedMeter);
  const [hpoLoopCount, SetHpoLoopCount] = useState(5);

  const [openLoading, setOpenLoading] = useState(false);

  const handleSliderChange = (event, newValue) => {
    SetHpoLoopCount(newValue);
  };

  const handleInputChange = (event) => {
    SetHpoLoopCount(event.target.value === "" ? "" : Number(event.target.value));
  };

  const onChangeMeter = (event) => {
    setSelectedMeter(event.target.value);
  };

  const onChangeAlgorithm = (event) => {
    const selectedValue = event.target.value;
    setSelectedAlgorithm(selectedValue);
    const params = algorithms.find((algo) => algo.name === selectedValue)?.parameters;
    setSelectedAlgoParams(params);

    // Create initial ParameterList
    const allParams = [...paramValues];
    params?.forEach((param) => {
      const newParam = { paramName: param.name, paramValue: param.default };
      allParams.push(newParam);
    });
    setParamValues(allParams);
  };

  const onChangeParameterOptimization = (event) => {
    setParameterOptimization(event.target.checked);
  };

  const onChangeModelComment = (event) => {
    setModelComment(event.target.value);
  };

  const onClickCreateModel = async () => {
    if (canCreateModel) {
      try {
        setAddRequestStatus("pending");
        setOpenLoading(true);
        await dispatch(
          createModel([
            selectedMeter,
            selectedAlgorithm,
            parameterOptimization,
            hpoLoopCount,
            paramValues,
            modelComment,
          ])
        );
      } catch (err) {
        console.error("Failed to create Model", err);
      } finally {
        setAddRequestStatus("idle");
        setOpenLoading(false);
      }
    }
  };

  const handleParameterChange = (name, value) => {
    const allParams = [...paramValues];
    const currentParam = allParams.find((param) => param.paramName === name);

    if (currentParam) {
      currentParam.paramValue = value;
    }

    setParamValues(allParams);
  };

  useEffect(() => {
    if (meterStatus === "idle") {
      dispatch(fetchAllMeters());
    }
  }, [meterStatus, dispatch]);

  useEffect(() => {
    if (modelStatus === "idle") {
      dispatch(fetchAllModels());
    }
  }, [modelStatus, dispatch]);

  useEffect(() => {
    if (algorithmStatus === "idle") {
      dispatch(fetchAllAlgorithms(true));
    }
  }, [algorithmStatus, dispatch]);

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <MDBox>
              <LayoutCard
                title="Model Management"
                description="Here you can train a model with all or a subset of the defined meters. 
                If meters are missing, please add them in the Meter Managment tab. 
                The model can then be used to create forecasts. 
                Hyperparameter Optimization is used to find the optimal parameter value, if you don't want to input values manually."
              >
                {modelError !== null ? <Alert severity="error">{modelError}</Alert> : null}
                {modelFulfilled !== null ? (
                  <Alert severity="success">{modelFulfilled}</Alert>
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
                      Selected Meter:
                    </MDTypography>

                    <MDBox sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <Select
                          value={selectedMeter || ""}
                          onChange={onChangeMeter}
                          sx={{ minHeight: 40 }}
                        >
                          <MenuItem sx={{ minHeight: 40 }} value="" key="">
                            Select a meter
                          </MenuItem>
                          {meters.map((meter) => (
                            <MenuItem sx={{ minHeight: 40 }} key={meter.id} value={meter.id}>
                              {meter.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </MDBox>

                    <MDTypography variant="h6" color="text">
                      Comment:
                    </MDTypography>
                    <FormControl fullWidth>
                      <TextField
                        value={modelComment}
                        onChange={onChangeModelComment}
                        size="small"
                        sx={{ Height: 40 }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} md={6} lg={6}>
                    <MDTypography variant="h6" color="text">
                      Algorithm:
                    </MDTypography>
                    <MDBox sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <Select
                          value={selectedAlgorithm || ``}
                          onChange={onChangeAlgorithm}
                          sx={{ minHeight: 40 }}
                        >
                          <MenuItem sx={{ minHeight: 40 }} value="" key="">
                            Select an algorithm
                          </MenuItem>
                          {algorithms.map((algo, index) => (
                            <MenuItem
                              sx={{ minHeight: 40 }}
                              key={`algo_${algo.name + index}`}
                              value={algo.name}
                            >
                              {algo.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </MDBox>

                    <MDTypography variant="h6" color="text">
                      Hyperparameter optimization:
                    </MDTypography>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Switch
                          checked={parameterOptimization}
                          onClick={onChangeParameterOptimization}
                        />
                      </Grid>
                      <Grid item>
                        {parameterOptimization ? (
                          <div>
                            <Grid container>
                              <Grid item>
                                <MDTypography variant="h6" color="text" display="inline">
                                  Number of configurations to run:
                                </MDTypography>
                              </Grid>
                              <Grid item>
                                <Slider
                                  sx={{ minWidth: 120, ml: 1, mt: 0.5 }}
                                  value={typeof hpoLoopCount === "number" ? hpoLoopCount : 0}
                                  step={1}
                                  min={1}
                                  max={50}
                                  onChange={handleSliderChange}
                                />
                              </Grid>
                              <Grid item>
                                <Input
                                  sx={{ ml: 2.5 }}
                                  value={hpoLoopCount}
                                  onChange={handleInputChange}
                                  size="small"
                                  inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 50,
                                    type: "number",
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>

                  {!parameterOptimization ? (
                    <Grid item xs={12} md={12} lg={12}>
                      <MDTypography variant="h6" color="text">
                        Algorithm Parameters:
                      </MDTypography>
                      <Grid container spacing={2}>
                        {selectedAlgoParams?.map((param, index) => (
                          <Grid item xs={3} md={3} lg={3} key={param.name}>
                            <ParameterCard
                              parameter={param}
                              onParameterChange={(name, value) =>
                                handleParameterChange(name, value)
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : null}

                  <Grid item xs={6} md={6} lg={6}>
                    <MDButton color="info" onClick={onClickCreateModel} disabled={!requiredFields}>
                      Train Model
                    </MDButton>

                    <MDTypography variant="subtitle2" color="text">
                      Estimated Time:{" "}
                      {algorithms.find((algo) => algo.name === selectedAlgorithm)
                        ?.estimatedTrainingTime ?? "N/A"}{" "}
                      min.
                      <Tooltip title="Estimated time required for the specified training session. If N/A, please run model training without hyperparameter optimization first. Based on that, you will get a reasonable estimate of the time required for a training session with hyperparameter optimization.">
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </MDTypography>
                  </Grid>
                </Grid>
              </LayoutCard>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <LayoutCard
              title="All available Models"
              description="Here you can find all trained Models. You can view some detailed information and be able to delete a model."
            >
              <Grid item xs={12} md={12} lg={12}>
                <ModelTable models={models} />
              </Grid>
            </LayoutCard>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ModelManagment;
