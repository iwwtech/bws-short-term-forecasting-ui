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
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";

import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

function ParameterCard({ parameter, onParameterChange }) {
  const [value, setValue] = useState(parameter.default);

  // Check Input value against min and max
  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);

    if (Number.isNaN(newValue)) {
      // If the entered value is not a number, reset to default value
      setValue(parameter.default);
      onParameterChange(parameter.name, parameter.default);
    } else if (newValue < parameter.options.minValue) {
      // If the entered value is less than the minimum value, set to minimum value
      setValue(parameter.options.minValue);
      onParameterChange(parameter.name, parameter.options.minValue);
    } else if (newValue > parameter.options.maxValue) {
      // If the entered value is greater than the maximum value, set to maximum value
      setValue(parameter.options.maxValue);
      onParameterChange(parameter.name, parameter.options.maxValue);
    } else {
      // Otherwise, set to the entered value
      setValue(newValue);
      onParameterChange(parameter.name, newValue);
    }
  };

  switch (parameter.type) {
    case "float":
      return (
        <Paper elevation={6} sx={{ minHeight: "110px" }}>
          <MDTypography variant="h6" color="text" sx={{ m: 1 }}>
            {parameter.name}
            <Tooltip title={parameter.description}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </MDTypography>
          <FormControl>
            <OutlinedInput
              id="outlined-start-adornment"
              sx={{ m: 1, minWidth: "140px" }}
              type="number"
              value={value}
              onChange={handleChange}
              aria-describedby="outlined-helper-text"
              inputprops={{ "aria-label": "weight" }}
            />
            <FormHelperText id="outlined-helper-text">
              Min: {parameter.options.minValue} Max: {parameter.options.maxValue}
            </FormHelperText>
          </FormControl>
        </Paper>
      );
    case "integer":
      return (
        <Paper elevation={6} sx={{ minHeight: "110px" }}>
          <MDTypography variant="h6" color="text" sx={{ m: 1 }}>
            {parameter.name}
            <Tooltip title={parameter.description}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </MDTypography>
          <FormControl>
            <OutlinedInput
              id="outlined-start-adornment"
              sx={{ m: 1, minWidth: "140px" }}
              type="number"
              value={value}
              onChange={handleChange}
              aria-describedby="outlined-helper-text"
              inputprops={{ "aria-label": "weight" }}
            />
            <FormHelperText id="outlined-helper-text">
              Min: {parameter.options.minValue} Max: {parameter.options.maxValue}
            </FormHelperText>
          </FormControl>
        </Paper>
      );
    case "categorical":
      return (
        <Paper elevation={6} sx={{ minHeight: "110px" }}>
          <MDTypography variant="h6" color="text" sx={{ m: 1 }}>
            {parameter.name}
            <Tooltip title={parameter.description}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </MDTypography>
          <FormControl>
            <Select
              sx={{ m: 1, minHeight: 45, minWidth: "140px" }}
              defaultValue={parameter.default}
              onChange={handleChange}
            >
              {parameter.options.categories.map((category, index) => (
                <MenuItem sx={{ minHeight: 40 }} key={`cat_${category + index}`} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="outlined-helper-text">Categorical</FormHelperText>
          </FormControl>
        </Paper>
      );
    default:
      return null;
  }
}

ParameterCard.propTypes = {
  parameter: PropTypes.objectOf(PropTypes.shape).isRequired,
  onParameterChange: PropTypes.func.isRequired,
};

export default ParameterCard;
