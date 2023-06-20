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
import { Alert, Box, FormControl, List, ListItem, ListItemText, TextField } from "@mui/material";
import MDButton from "components/MDButton";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { fetchAllMeters, postVirtualMeter, deleteVirtualMeter } from "redux/slices/meterSlice";

import ListItemWithDeleteDialog from "./components/ListItemWithDeleteDialog";

function MeterManagment() {
  const [checked, setChecked] = useState([]);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const canSave = addRequestStatus === "idle";
  const canDelete = addRequestStatus === "idle";
  // const disabledMeters = useState([]);
  const [disabledMeters, setDisabledMeters] = useState([]);
  const [meterName, setMeterName] = useState([]);

  const dispatch = useDispatch();

  const meters = useSelector((state) => state.meter.meters);
  const meterStatus = useSelector((state) => state.meter.status);
  const meterError = useSelector((state) => state.meter.error);
  const meterfulfilled = useSelector((state) => state.meter.fulfilled);

  // Checkbox Toggle Handler
  const meterCheckedToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // On Save new virtual meter
  const onPostVirtualMeter = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(postVirtualMeter([checked, meterName]));
      } catch (err) {
        console.error("Failed to save virtual meter", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  // On delete virtual Meter
  const onDeleteVirtualMeter = async (elementId) => {
    if (canDelete) {
      try {
        setAddRequestStatus("pending");

        await dispatch(deleteVirtualMeter(elementId));
      } catch (err) {
        console.error("Failed to delete virtual meter", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  // Fetching all physical and virtual meter
  useEffect(() => {
    if (meterStatus === "idle") {
      dispatch(fetchAllMeters());
    }
  }, [meterStatus, dispatch]);

  // Recursiv Func for disabling meters
  function getLastLevelSubMeterIds(subMeterIds) {
    const lastLevelSubMeterIds = [];
    subMeterIds.forEach((subMeterId) => {
      const subMeter = meters.find((meter) => meter.id === subMeterId);
      if (subMeter != null && subMeter.submeterIds != null) {
        lastLevelSubMeterIds.push(subMeter.id);
        lastLevelSubMeterIds.push(...getLastLevelSubMeterIds(subMeter.submeterIds));
      } else {
        lastLevelSubMeterIds.push(subMeterId);
      }
    });
    return lastLevelSubMeterIds;
  }

  // Define all disabled meters
  useEffect(() => {
    const disabledMeterIds = [];
    const meterSubMeterList = [];

    // Create List of Meters with raw-submeters
    meters.forEach((meter) => {
      const subMeterList = [meter.id];

      if (meter.submeterIds != null) {
        subMeterList.push(getLastLevelSubMeterIds(meter.submeterIds));
      }
      meterSubMeterList.push(subMeterList);
    });

    // Get disabled meters by checked meters
    disabledMeterIds.push([]);

    checked.forEach((checkedMeter) => {
      // Get Disabled Submeters
      const checkedMeterSubmeters = meterSubMeterList.find((meter) => meter[0] === checkedMeter.id);
      const submeterIds = checkedMeterSubmeters.splice(1);

      disabledMeterIds[0] = disabledMeterIds[0].concat(...submeterIds);

      // Get Disabled Supermeters
      const checkedMetersSupermeter = meterSubMeterList.filter((meter) => {
        const submeters = [];
        meter.forEach((submeter) => submeters.push(...submeter));

        return submeters.includes(checkedMeter.id) && meter[0] !== checkedMeter.id;
      });

      disabledMeterIds[0] = disabledMeterIds[0].concat(...checkedMetersSupermeter);

      // Get meters with exact submeters
      const exactSubmeterMeters = meters.filter((meter) => {
        if (meter.submeterIds && checkedMeter.submeterIds) {
          const meterSubmeterIdsSorted = [...meter.submeterIds].sort();
          const checkedMeterSubmeterIdsSorted = [...checkedMeter.submeterIds].sort();
          return (
            JSON.stringify(meterSubmeterIdsSorted) ===
              JSON.stringify(checkedMeterSubmeterIdsSorted) && meter.id !== checkedMeter.id
          );
        }
        return false;
      });

      disabledMeterIds[0] = disabledMeterIds[0].concat(
        ...exactSubmeterMeters.map((meter) => meter.id)
      );
    });

    setDisabledMeters(...disabledMeterIds);
  }, [checked]);

  // Check meterid against disabled meter list
  const isDisabledMeter = (disabledMetersList, id) => {
    if (disabledMetersList != null) {
      const matchingObject = disabledMetersList.find((element) => element === id);
      return Boolean(matchingObject);
    }
    return false;
  };

  const onChangeMeterName = (event) => {
    setMeterName(event.target.value);
  };

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <MDBox>
              <LayoutCard
                title="Meter Managment"
                description="Here you can select a Meter, and view his informations. 
                  You can also select multiple Meters to create a virtual Meter with the selected meters as submeters. 
                  If you don't want a meter in the List, you can delete it via the button in the list.
                  A selected meter will disable other meters that are a submeter of the selected one."
              >
                {meterError !== null ? <Alert severity="error">{meterError}</Alert> : null}
                {meterfulfilled !== null ? (
                  <Alert severity="success">{meterfulfilled}</Alert>
                ) : null}

                <Grid container spacing={3}>
                  <Grid container item>
                    <Grid item xs={4} md={4} lg={4}>
                      <MDTypography variant="h4" color="text">
                        Meter List:
                      </MDTypography>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8}>
                      <MDTypography variant="h4" color="text">
                        Meter Info:
                      </MDTypography>
                    </Grid>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <List sx={{ overflow: "auto", maxHeight: 400 }}>
                      {meters.map((meter) => (
                        <ListItemWithDeleteDialog
                          key={meter.id}
                          meter={meter}
                          checked={checked}
                          meterCheckedToggle={meterCheckedToggle}
                          onDeleteVirtualMeter={onDeleteVirtualMeter}
                          isDisabledMeter={isDisabledMeter}
                          disabledMeters={disabledMeters}
                        />
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={8} md={8} lg={8}>
                    <Grid item xs={12}>
                      <Box>
                        {(() => {
                          switch (checked.length) {
                            case 1:
                              return (
                                <div>
                                  <MDTypography variant="h6">Meter name:</MDTypography>
                                  <MDTypography variant="body2">{checked[0].id}</MDTypography>
                                  {typeof checked[0].type !== "undefined" ? (
                                    <div>
                                      <MDTypography variant="h6">Meter description:</MDTypography>
                                      <MDTypography variant="body2">
                                        {checked[0].description}
                                      </MDTypography>
                                      <MDTypography variant="h6">Meter date:</MDTypography>
                                      <MDTypography variant="body2">{checked[0].date}</MDTypography>

                                      <MDTypography variant="h6">Meter county:</MDTypography>
                                      <MDTypography variant="body2">
                                        {checked[0].address.addressCountry}
                                      </MDTypography>
                                      <MDTypography variant="h6">Meter locality:</MDTypography>
                                      <MDTypography variant="body2">
                                        {checked[0].address.addressLocality}
                                      </MDTypography>
                                      <MDTypography variant="h6">
                                        Meter street address:
                                      </MDTypography>
                                      <MDTypography variant="body2">
                                        {checked[0].address.streetAddress}
                                      </MDTypography>
                                    </div>
                                  ) : (
                                    <div>
                                      <MDTypography variant="h6">Meter date:</MDTypography>
                                      <MDTypography variant="body2">
                                        {checked[0].dateCreated}
                                      </MDTypography>
                                      <MDTypography variant="h6">List of submeters:</MDTypography>
                                      <List>
                                        {checked[0].submeterIds.map((option) => (
                                          <ListItem key={option} value={option}>
                                            <ListItemText
                                              primaryTypographyProps={{ fontSize: 14 }}
                                              primary={option}
                                            />
                                          </ListItem>
                                        ))}
                                      </List>
                                      <MDTypography variant="h6">List of supermeters:</MDTypography>
                                      <List>
                                        {checked[0].supermeterIds.map((option) => (
                                          <ListItem key={option} value={option}>
                                            <ListItemText
                                              primaryTypographyProps={{ fontSize: 14 }}
                                              primary={option}
                                            />
                                          </ListItem>
                                        ))}
                                      </List>
                                    </div>
                                  )}
                                </div>
                              );
                            case 0:
                              return (
                                <MDTypography variant="body2">
                                  No meter selected. Please select a meter.
                                </MDTypography>
                              );
                            default:
                              return (
                                <div>
                                  <MDTypography variant="h6">
                                    Create virtual meter from selected meters ({checked.length})
                                  </MDTypography>
                                  <List>
                                    {checked.map((option) => (
                                      <ListItem key={option.id} value={option.id}>
                                        <ListItemText
                                          primaryTypographyProps={{ fontSize: 14 }}
                                          primary={option.id}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                  <FormControl>
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={12} lg={12}>
                                        <MDTypography variant="h6">
                                          Name for virtual Meter (optional):
                                        </MDTypography>

                                        <TextField
                                          value={meterName}
                                          onChange={onChangeMeterName}
                                          size="small"
                                          sx={{ Height: 40, width: 300 }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={12} lg={12}>
                                        <MDButton onClick={onPostVirtualMeter} color="info">
                                          Create Virtual Meter
                                        </MDButton>
                                      </Grid>
                                    </Grid>
                                  </FormControl>
                                </div>
                              );
                          }
                        })()}
                      </Box>
                    </Grid>
                    <Grid />
                  </Grid>

                  <Grid item xs={6} md={6} lg={6}>
                    <MDButton onClick={() => setChecked([])} color="info">
                      Clear selection
                    </MDButton>
                  </Grid>
                </Grid>
              </LayoutCard>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default MeterManagment;
