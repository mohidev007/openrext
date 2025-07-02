import { Router } from "express";
import emailRoutes from "./emailRoutes.js";
import healthRoutes from "./healthRoutes.js";
import cronRoutes from "./cronRoutes.js";
import testRoutes from "./testRoutes.js";

const router = Router();

// Mount all route modules
router.use("/", healthRoutes);
router.use("/", emailRoutes);
router.use("/api/cron", cronRoutes);
router.use("/", testRoutes);

export default router;
