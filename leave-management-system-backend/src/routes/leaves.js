const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require("moment");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "leavemanagementsystem",
});

// Attempt to connect
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL!");
    // Perform any operations you need here

    // Close the connection
    // db.end();
  }
});

//request leave api
router.post("/requestLeave", (req, res) => {
  const startDate = moment(req.body.startDate, "DD-MM-YYYY").format(
    "YYYY-MM-DD"
  );
  const endDate = moment(req.body.endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  const numberOfDays = req.body.numberOfDays;
  const leaveType = req.body.leaveType;
  const reason = req.body.reason;
  const status = "pending";
  const userId = req.body.userId;

  //fetching user by user id
  const getUserByUserIdQuery =
    "SELECT * FROM leavemanagementsystem.users WHERE user_id = ?";

  let user;
  db.query(getUserByUserIdQuery, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.send("Unable to fetch user information. Error occurred!");
    } else {
      user = results[0];
      const sickLeaveBalance = user.sick_leave_balance;
      const paidLeaveBalance = user.paid_leave_balance;
      const userName = user.user_name;
      //validating leave balances
      if (leaveType === "Sick Leave") {
        if (numberOfDays > sickLeaveBalance) {
          res.send("You don't have sufficient sick leave balance");
        }
      }
      if (leaveType === "Paid Leave") {
        if (numberOfDays > paidLeaveBalance) {
          res.send("You don't have sufficient paid leave balance");
        }
      }

      //validation success, inserting into db
      db.query(
        "INSERT INTO leave_requests (start_date,end_date,number_of_days,leave_type,reason,status,user) VALUES (?,?,?,?,?,?,?) ",
        [startDate, endDate, numberOfDays, leaveType, reason, status, userName],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Leave request successfull!");
          }
        }
      );
    }
  });
});

//approve Leave api
router.post("/approveLeave/:id", (req, res) => {
  const leaveRequestId = req.params.id;
  let userName;
  let leaveType;
  let numberOfLeaves;

  //finding leave by id
  const getLeaveByIdQuery =
    "SELECT * FROM leave_requests WHERE leave_request_id = ?";

  db.query(getLeaveByIdQuery, [leaveRequestId], (error, results) => {
    if (error) {
      console.error("Error fetching leave request data:", error);
      res.send(null);
    }

    if (results.length > 0) {
      const leaveRequest = results[0];

      const status = "Approved";
      const dateResolved = new Date();
      const resolvedBy = "admin";
      console.log(leaveRequest.user);
      userName = leaveRequest.user;
      leaveType = leaveRequest.leave_type;
      numberOfLeaves = leaveRequest.number_of_days;

      //updating leave request in db
      const updateQuery =
        "UPDATE leave_requests SET status = ?, date_resolved = ?, resolved_by = ? WHERE leave_request_id = ?";
      db.query(
        updateQuery,
        [status, dateResolved, resolvedBy, leaveRequestId],
        (error, results) => {
          if (error) {
            console.error("Error updating leave request data:", error);
            res.send(null);
          }
          if (results.affectedRows > 0) {
            console.log("Updated leave request to approved");
          }

          // update balance leave for user
          console.log("userName " + userName);
          const getUserByUserNameQuery =
            "SELECT * FROM users WHERE user_name = ?";
          let newLeaveBalance;
          let updateLeaveQuery;
          let sickLeaveBalance;
          let paidLeaveBalance;
          db.query(getUserByUserNameQuery, [userName], (error, results) => {
            if (error) {
              console.error("Error getting user info", error);
            }
            if (results.length > 0) {
              sickLeaveBalance = results[0].sick_leave_balance;
              paidLeaveBalance = results[0].paid_leave_balance;
            }

            console.log("sickLeaveBalance  " + sickLeaveBalance);
            console.log("paidLeaveBalance  " + paidLeaveBalance);
            console.log("leaveType  " + leaveType);

            if (leaveType === "Sick Leave") {
              newLeaveBalance = sickLeaveBalance - numberOfLeaves;
              updateLeaveQuery =
                "UPDATE users SET sick_leave_balance = ? WHERE user_name = ?";
            } else if (leaveType === "Paid Leave") {
              newLeaveBalance = paidLeaveBalance - numberOfLeaves;
              updateLeaveQuery =
                "UPDATE users SET paid_leave_balance = ? WHERE user_name = ?";
            }

            console.log("new leave balance " + newLeaveBalance);
            console.log("updateLeaveQuery " + updateLeaveQuery);

            db.query(
              updateLeaveQuery,
              [newLeaveBalance, userName],
              (error, results) => {
                if (error) {
                  console.error("Error updating leave request data:", error);
                }
                if (results.affectedRows > 0) {
                  console.log("Updated user leave balance");
                  res.send("Successfully Approved Leave request!");
                }
              }
            );
          });
        }
      );
    } else {
      // No leave request found with the provided leave request id
      res.send(null);
    }
  });
});

//reject leave api
router.post("/rejectLeave/:id", (req, res) => {
  const leaveRequestId = req.params.id;

  //todo find leave by id
  const getLeaveByIdQuery =
    "SELECT * FROM leave_requests WHERE leave_request_id = ?";

  db.query(getLeaveByIdQuery, [leaveRequestId], (error, results) => {
    if (error) {
      console.error("Error fetching leave request data:", error);
      res.send(null);
    }

    if (results.length > 0) {
      const leaveRequest = results[0];

      const status = "Rejected";
      const dateResolved = new Date();
      const resolvedBy = "admin";

      //updating leave request in db
      const updateQuery =
        "UPDATE leave_requests SET status = ?, date_resolved = ?, resolved_by = ? WHERE leave_request_id = ?";
      db.query(
        updateQuery,
        [status, dateResolved, resolvedBy, leaveRequestId],
        (error, results) => {
          if (error) {
            console.error("Error updating leave request data:", error);
            res.send(null);
          }
          if (results.affectedRows > 0) {
            console.log("Updated leave request to rejected");
            res.send("Updated leave request to rejected");
          }
        }
      );
    } else {
      // No leave request found with the provided leave request id
      res.send(null);
    }
  });
});

//get Leaves by user Id api
router.get("/getLeavesByUserName/:name", (req, res) => {
  const userName = req.params.name;

  const getAllLeavesByUserIdQuery =
    "SELECT * FROM leave_requests WHERE user = ?";

  db.query(getAllLeavesByUserIdQuery, [userName], (error, results) => {
    if (results.length > 0) {
      res.send(results);
    }
  });
});

//get all leaves api
router.get("/getAllLeaves", (req, res) => {
  const getAllLeavesQuery = "SELECT * FROM leave_requests";

  db.query(getAllLeavesQuery, (error, results) => {
    if (results.length > 0) {
      res.send(results);
    }
  });
});

module.exports = router;