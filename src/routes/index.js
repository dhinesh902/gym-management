import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.js";
import { uploadProfilePhoto, processProfilePhoto } from "../middlewares/uploadMiddleware.js";

import * as authController from "../controllers/authController.js";
import * as memberController from "../controllers/memberController.js";
import * as trainerController from "../controllers/trainerController.js";
import * as attendanceController from "../controllers/attendanceController.js";
import * as paymentController from "../controllers/paymentController.js";
import * as workoutController from "../controllers/workoutController.js";
import * as dietController from "../controllers/dietController.js";
import * as membershipController from "../controllers/membershipController.js";
import * as dashboardController from "../controllers/dashboardController.js";

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.post("/members/login", memberController.loginMember);
router.post("/trainers/login", trainerController.loginTrainer);

// Member routes
router.post("/members/get", authMiddleware, memberController.getAllMembers);
router.post("/members/add", authMiddleware, uploadProfilePhoto, processProfilePhoto, memberController.createMember);
router.post("/members/get/:id", authMiddleware, memberController.getMemberById);
router.post("/members/edit/:id", authMiddleware, uploadProfilePhoto, processProfilePhoto, memberController.updateMember);
router.post("/members/status/:id", authMiddleware, memberController.updateMemberStatus);
router.post("/members/delete/:id", authMiddleware, memberController.deleteMember);

// Trainer routes
router.post("/trainers/get", authMiddleware, trainerController.getAllTrainers);
router.post("/trainers/add", authMiddleware, uploadProfilePhoto, processProfilePhoto, trainerController.createTrainer);
router.post("/trainers/get/:id", authMiddleware, trainerController.getTrainerById);
router.post("/trainers/edit/:id", authMiddleware, uploadProfilePhoto, processProfilePhoto, trainerController.updateTrainer);
router.post("/trainers/status/:id", authMiddleware, trainerController.updateTrainerStatus);
router.post("/trainers/delete/:id", authMiddleware, trainerController.deleteTrainer);

// Attendance routes
router.post(
    "/attendance/get",
    authMiddleware,
    attendanceController.getAllAttendance,
);
router.post(
    "/attendance/check-in/add",
    authMiddleware,
    attendanceController.markAttendance,
);

// Payment routes
router.post("/payments/get", authMiddleware, paymentController.getAllPayments);
router.post("/payments/add", authMiddleware, paymentController.createPayment);

// Workout routes
router.post("/workouts/get", authMiddleware, workoutController.getAllWorkouts);
router.post("/workouts/add", authMiddleware, workoutController.createWorkout);
router.post("/workouts/edit/:id", authMiddleware, workoutController.updateWorkout);
router.post("/workouts/delete/:id", authMiddleware, workoutController.deleteWorkout);

// Diet routes
router.post("/diets/get", authMiddleware, dietController.getAllDiets);
router.post("/diets/add", authMiddleware, dietController.createDiet);
router.post("/diets/edit/:id", authMiddleware, dietController.updateDiet);
router.post("/diets/delete/:id", authMiddleware, dietController.deleteDiet);

// Membership routes
router.post("/plans/get", authMiddleware, membershipController.getAllPlans);
router.post("/plans/add", authMiddleware, membershipController.createPlan);
router.post("/plans/edit/:id", authMiddleware, membershipController.updatePlan);
router.post("/plans/delete/:id", authMiddleware, membershipController.deletePlan);
router.post(
    "/subscriptions/get",
    authMiddleware,
    membershipController.getAllSubscriptions,
);
router.post(
    "/subscriptions/add",
    authMiddleware,
    membershipController.assignSubscription,
);

// Dashboard routes
router.post("/dashboard/stats/get", authMiddleware, dashboardController.getStats);

export default router;
