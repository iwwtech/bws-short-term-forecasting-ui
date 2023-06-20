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
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import PropTypes from "prop-types";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteForeverRounded";
import MeterDeleteDialog from "./MeterDeleteDialog";

function ListItemWithDeleteDialog({
  meter,
  onDeleteVirtualMeter,
  checked,
  meterCheckedToggle,
  isDisabledMeter,
  disabledMeters,
}) {
  const [deletePopup, setDeletePopup] = useState(false);

  return (
    <ListItem
      sx={{ maxHeight: 35 }}
      key={meter.id}
      value={meter.id}
      secondaryAction={
        typeof meter.type === "undefined" ? (
          <IconButton
            onClick={() => {
              setDeletePopup(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null
      }
    >
      <ListItemButton
        sx={{ maxHeight: 35 }}
        role={undefined}
        onClick={meterCheckedToggle(meter)}
        disabled={isDisabledMeter(disabledMeters, meter.id)}
      >
        <ListItemIcon>
          <Checkbox edge="start" checked={checked.indexOf(meter) !== -1} disableRipple />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ fontSize: 14 }}
          primary={meter.id.replace("urn:ngsi-ld:", "")}
        />
      </ListItemButton>
      {typeof meter.type === "undefined" && (
        <MeterDeleteDialog
          id={meter.id}
          open={deletePopup}
          close={() => {
            setDeletePopup(false);
          }}
          action={(e) => {
            onDeleteVirtualMeter(meter.id);
            setDeletePopup(false);
          }}
        />
      )}
    </ListItem>
  );
}

ListItemWithDeleteDialog.propTypes = {
  meter: PropTypes.shape().isRequired,
  checked: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape)).isRequired,
  onDeleteVirtualMeter: PropTypes.func.isRequired,
  meterCheckedToggle: PropTypes.func.isRequired,
  isDisabledMeter: PropTypes.func.isRequired,
  disabledMeters: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ListItemWithDeleteDialog;
