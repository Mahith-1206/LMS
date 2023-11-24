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

  //todo fetch user by user id and populate these twi
  const sickLeaveBalance = 0;
  const paidLeaveBalance = 0;

  //todo complete this fully
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
});

//approve Leave api
app.post("/leave/approveLeave/:id", (req, res) => {
  const leaveRequestId = req.params.id;

  //todo find leave by id

  //todo update status, date resolved, resolved by and save it in db

  //todo update balance leave for user
});

//reject leave api
app.post("/leave/rejectLeave/:id", (req, res) => {
  const leaveRequestId = req.params.id;

  //todo find leave by id

  //todo update status, date resolved, resolved by and save it in db
});

//get Leaves by user Id api
app.get("/leave/getLeavesByUserId/:id", (req, res) => {
  const userId = req.params.id;
});

//get all leaves api
app.get("/leave/getAllLeaves", (req, res) => {});
