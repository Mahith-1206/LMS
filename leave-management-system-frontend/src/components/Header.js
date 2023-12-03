import "../styles/Header.css";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar className="appbar">
        <Typography variant="h4">Leave Management System</Typography>
      </Toolbar>
      <Toolbar sx={{ minHeight: "64px", backgroundColor: "rgb(92, 160, 185)" }}>
        <Button variant="h6">Leave Requests</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
