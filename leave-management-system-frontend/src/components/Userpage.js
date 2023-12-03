import React, { useState } from "react";
import "../styles/UserPage.css"; // Import your stylesheet

const UserPage = (props) => {
  const {
    user_id,
    user_name,
    password,
    email,
    name,
    role,
    sick_leave_balance,
    paid_leave_balance,
  } = props;

  console.log("user name from props: " + props.user_name);

  return (
    <div className="user-page">
      <h1>User Information</h1>
      <div className="user-info">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Paid Leaves:</strong> {paid_leave_balance}
        </p>
      </div>
    </div>
  );
};

export default UserPage;
