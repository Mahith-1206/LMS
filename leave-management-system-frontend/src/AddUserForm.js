// AddUserForm.js
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function AddUserForm() {
  // Add your form logic here

  return (
    <div>
      <h2>Add User</h2>
      <form>
        <TextField label="Username" variant="outlined" fullWidth />
        {/* Add other form fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          Add User
        </Button>
      </form>
    </div>
  );
}

export default AddUserForm;
