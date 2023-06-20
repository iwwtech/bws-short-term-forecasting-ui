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

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";

function MeterDeleteDialog({ id, open, close, action }) {
  return (
    <Dialog id={id} open={open} onClose={close}>
      <DialogTitle>Do you really want to delete meter?</DialogTitle>
      <DialogContent>Delete meter {id} ?</DialogContent>
      <DialogActions>
        <MDButton color="info" onClick={close}>
          No
        </MDButton>
        <MDButton onClick={action}>Delete Virtual Meter</MDButton>
      </DialogActions>
    </Dialog>
  );
}

MeterDeleteDialog.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
};

export default MeterDeleteDialog;
