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

import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/DeleteForeverRounded";
import InfoIcon from "@mui/icons-material/Info";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteModelByID } from "redux/slices/modelSlice";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartToolTip,
  Legend,
  Brush,
} from "recharts";

import ModelDeleteDialog from "./ModelDeleteDialog";

function ModelTable({ models }) {
  const dispatch = useDispatch();
  const [deleteRequestStatus, setDeleteRequestStatus] = useState("idle");
  const canDelete = deleteRequestStatus === "idle";

  const [deletePopupId, setDeletePopupId] = useState(null);

  const onModelDelete = async (modelId) => {
    if (canDelete) {
      try {
        setDeleteRequestStatus("pending");

        await dispatch(deleteModelByID(modelId));
      } catch (err) {
        console.error("Failed to delete model", err);
      } finally {
        setDeleteRequestStatus("idle");
      }
    }
  };

  const [openStates, setOpenStates] = useState({});
  const [modelData, setModelData] = useState({});

  // Handle collapse and linechart data
  const handleToggleOpen = (modelId) => {
    setOpenStates((prevOpenStates) => ({
      ...prevOpenStates,
      [modelId]: !prevOpenStates[modelId],
    }));

    setModelData((prevModelData) => {
      const model = models.find((m) => m.id === modelId);

      if (!model) {
        return prevModelData; // Return previous state if model is not found
      }

      return {
        ...prevModelData,
        [modelId]: model.evaluation.actualTestConsumption.map((value, index) => ({
          name: index,
          consumption: value,
          predicted: model.evaluation.predictedTestConsumption[index],
          timestamp: model.evaluation.testTimestamps[index],
        })),
      };
    });
  };

  // Change Datetime to only Date
  const customAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fontSize={10} textAnchor="middle" fill="#666">
        {payload.value.split("T")[0]}
      </text>
    </g>
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ display: "table-header-group" }}>
          <TableRow>
            <TableCell />
            <TableCell>
              <MDTypography variant="h6">Model ID</MDTypography>
            </TableCell>
            <TableCell align="right">
              <MDTypography variant="h6">Algorithm</MDTypography>
            </TableCell>
            <TableCell align="right">
              <MDTypography variant="h6">Date Created</MDTypography>
            </TableCell>
            <TableCell align="right">
              <MDTypography variant="h6">Date Modified</MDTypography>
            </TableCell>
            <TableCell align="right">
              <MDTypography variant="h6" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models?.map((model) => (
            <React.Fragment key={model.id}>
              <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleToggleOpen(model.id)}
                  >
                    {openStates[model.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell omponent="th" scope="row">
                  {model.id}
                </TableCell>
                <TableCell align="right">{model.algorithm}</TableCell>
                <TableCell align="right">{model.dateCreated}</TableCell>
                <TableCell align="right">{model.dateModified}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setDeletePopupId(model.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <ModelDeleteDialog
                    id={model.id}
                    open={deletePopupId === model.id}
                    close={() => setDeletePopupId(null)}
                    action={(e) => {
                      onModelDelete(model.id);
                      setDeletePopupId(null);
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={openStates[model.id]} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={3} md={3} lg={3}>
                          <MDTypography variant="h6">
                            MAPE:
                            <Tooltip title="Mean Absolute Percentage Error: This metric tells you the average percentage by which the model's predictions deviate from the actual values.">
                              <IconButton>
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </MDTypography>
                          {parseFloat(model.evaluation.metrics.mape).toFixed(5)}
                        </Grid>

                        <Grid item xs={3} md={3} lg={3}>
                          <MDTypography variant="h6">
                            RMSE:
                            <Tooltip title="Root Mean Square Error - This metric tells you how much the model's predictions deviate from the actual values on average. It penalizes larger errors more due to a squaring operation. Lower RMSE values indicate more precise predictions, however, the exact score is influenced by the scale of your data.">
                              <IconButton>
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </MDTypography>

                          {parseFloat(model.evaluation.metrics.rmse).toFixed(5)}
                        </Grid>

                        <Grid item xs={12} md={12} lg={12}>
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                              width={1000}
                              height={400}
                              data={modelData[model.id]}
                              margin={{ top: 5, right: 90, bottom: 55, left: 10 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="consumption"
                                stroke="#8884d8"
                                strokeWidth={1.5}
                                name="actual consumption"
                              />
                              <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#82ca9d"
                                strokeWidth={1.5}
                                name="predicted consumption"
                              />

                              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                              <XAxis
                                dataKey="timestamp"
                                tick={customAxisTick}
                                interval={24}
                                allowDataOverflow
                              />
                              <YAxis
                                label={{
                                  value: `m³/h`,
                                  style: { textAnchor: "middle" },
                                  angle: -90,
                                  position: "left",
                                  offset: 0,
                                }}
                                tick={{ fontSize: 14 }}
                              />
                              <ChartToolTip
                                formatter={(value) =>
                                  new Intl.NumberFormat("en", {
                                    maximumFractionDigits: 2,
                                  }).format(value)
                                }
                              />
                              <Legend />
                              <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
                            </LineChart>
                          </ResponsiveContainer>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ModelTable.propTypes = {
  models: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ModelTable;
