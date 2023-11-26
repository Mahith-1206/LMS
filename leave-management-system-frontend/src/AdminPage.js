import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Button,
} from "@mui/material";

const AdminPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const getLeaveRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/leave/getAllLeaves"
      );
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracting the date portion
  };

  // useEffect hook to fetch leave requests when the component mounts
  useEffect(() => {
    getLeaveRequests();
  }, []);

  // Function to handle approval or rejection of a leave request
  const handleAction = (id, action) => {
    // You can perform the approval or rejection logic here
    console.log(`Leave ID: ${id} - Action: ${action}`);
    // You may want to update the UI or make another API call to reflect the change
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              ID
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              Employee
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              Start Date
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              End Date
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              {" "}
              Number of Days
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              Leave Type
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              Reason
            </TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.leave_request_id}>
              <TableCell>{request.leave_request_id}</TableCell>
              <TableCell>{request.user}</TableCell>
              <TableCell>{formatDate(request.start_date)}</TableCell>
              <TableCell>{formatDate(request.end_date)}</TableCell>
              <TableCell>{request.number_of_days}</TableCell>
              <TableCell>{request.leave_type}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <button
                  className="approve-btn"
                  onClick={() =>
                    handleAction(request.leave_request_id, "approve")
                  }
                  disabled={
                    request.status === "Approved" ||
                    request.status === "Rejected"
                  }
                >
                  Approve
                </button>
              </TableCell>
              <TableCell>
                <button
                  className="reject-btn"
                  onClick={() =>
                    handleAction(request.leave_request_id, "reject")
                  }
                  disabled={
                    request.status === "Approved" ||
                    request.status === "Rejected"
                  }
                >
                  Reject
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminPage;
