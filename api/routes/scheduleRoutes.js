const express = require("express");
const validateToken = require("../middleware/validateToken");
const { createSchedule, cancelSchedule, getUserSchedules } = require("../services/ScheduleService");
const router = express.Router();

router.post("/create-schedule", validateToken, createSchedule);
router.post("/cancel-schedule", validateToken, cancelSchedule);
router.get("/get-schedules", validateToken, getUserSchedules);

module.exports = router;
