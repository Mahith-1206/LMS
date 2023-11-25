import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

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

  // Render the component
  return (
    <div>
      <h1>Leave Requests</h1>
      <ul className="leave-list">
        {leaveRequests.map((leave) => (
          <li key={leave.leave_request_id} className="leave-item">
            <div className="employee-name">{leave.user}</div>
            <div className="date-range">
              {leave.start_date} to {leave.end_date}
            </div>
            <div>
              <button
                className="approve-btn"
                onClick={() => handleAction(leave.leave_request_id, "approve")}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleAction(leave.leave_request_id, "reject")}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
