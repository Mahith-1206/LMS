const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "leavemanagementsystem",
});

app.listen(3001, () => {
  console.log("Server running on port 3001...");
});

//request leave api
app.post("/leave/requestLeave", (req, res) => {
  const startDate = req.body.startdate;
  const endDate = req.body.endDate;
  const numberOfDays = req.body.numberOfDays;
  const leaveType = req.body.leaveType;
  const reason = req.body.reason;
  const status = "pending";
  const dateSubmitted = Date.now();
  const userId = req.body.userId;

  //fetching user by user id
  const getUserByUserIdQuery = "SELECT * FROM users WHERE user_id = ?";
  db.query(getUserByUserIdQuery, [userId]),
    (err, results) => {
      if (err) {
        console.error(err);
        res.send(null);
      }

      if (results.length > 0) {
        const user = results[0];
        const sickLeaveBalance = user.sick_leave_balance;
        const paidLeaveBalance = user.paid_leave_balance;

        //validating leave balances
        if (leaveType === "Sick Leave") {
          if (numberOfDays > sickLeaveBalance) {
            res.send(null);
          }
        }
        if (leaveType === "Paid Leave") {
          if (numberOfDays > paidLeaveBalance) {
            res.send(null);
          }
        }

        //validation success, inserting into db
        db.query(
          "INSERT INTO leave_requests (start_date,end_date,number_of_days,date_submitted,leave_type,reason,status,user_id) VALUES (?,?,?,?,?,?,?,?) ",
          [
            startDate,
            endDate,
            numberOfDays,
            dateSubmitted,
            leaveType,
            reason,
            status,
            userId,
          ]
        ),
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Leave request successfull!");
            }
          };
      }
    };
});

//approve Leave api
app.post("/leave/approveLeave/:id", (req, res) => {
  const leaveRequestId = req.params.id;
  let userId;
  let leaveType;
  let numberOfLeaves;
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

      const status = "Approved";
      const dateResolved = Date.now();
      const resolvedBy = "admin";
      userId = results.user_id;
      leaveType = results.leave_type;
      numberOfLeaves = results.number_of_days;

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
            res.send("Updated leave request to approved");
          }
        }
      );
    } else {
      // No leave request found with the provided leave request id
      res.send(null);
    }
  });

  //todo update balance leave for user

  const getUserByUserIdQuery = "SELECT * FROM users WHERE user_id = ?";
  let newLeaveBalance;
  let updateLeaveQuery;
  db.query(getUserByUserIdQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error getting user info", error);
      res.send(null);
    }
    if (results.length > 0) {
      const sickLeaveBalance = user.sick_leave_balance;
      const paidLeaveBalance = user.paid_leave_balance;
    }

    if (leaveType === "Sick Leave") {
      newLeaveBalance = sickLeaveBalance - 1;
      updateLeaveQuery =
        "UPDATE users SET sick_leave_balance = ? WHERE user_id = ?";
    } else if (leaveType === "Paid Leave") {
      newLeaveBalance = paidLeaveBalance - 1;
      updateLeaveQuery =
        "UPDATE users SET paid_leave_balance = ? WHERE user_id = ?";
    }

    db.query(
      updateLeaveQuery,
      [newLeaveBalance, leaveRequestId],
      (error, results) => {
        if (error) {
          console.error("Error updating leave request data:", error);
          res.send(null);
        }
        if (results.affectedRows > 0) {
          console.log("Updated leave request to approved");
          res.send("Updated leave request to approved");
        }
      }
    );
  });
});

//reject leave api
app.post("/leave/rejectLeave/:id", (req, res) => {
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
      const dateResolved = Date.now();
      const resolvedBy = "admin";
      userId = results.user_id;
      leaveType = results.leave_type;
      numberOfLeaves = results.number_of_days;

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
app.get("/leave/getLeavesByUserId/:id", (req, res) => {
  const userId = req.params.id;

  const getAllLeavesByUserIdQuery =
    "SELECT * FROM leave_requests WHERE user_id = ?";

  db.query(getAllLeavesByUserIdQuery, [userId], (error, results) => {
    if (results.length > 0) {
      res.send(results);
    }
  });
});

//get all leaves api
app.get("/leave/getAllLeaves", (req, res) => {
  const getAllLeavesQuery = "SELECT * FROM leave_requests";

  db.query(getAllLeavesQuery, (error, results) => {
    if (results.length > 0) {
      res.send(results);
    }
  });
});
