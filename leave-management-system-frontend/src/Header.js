import "./Header.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function Header() {
  return (
    <header className="header">
      <h1>Leave Management System!</h1>
      <Button style={{ backgroundColor: "#f5ba13", color: "white" }}>
        Add Employee
      </Button>
    </header>
  );
}

export default Header;
