import { Router } from "express";
import onboardingRouter from "./onboarding/OnboardingRoutes";

const apiRouter = Router();

apiRouter.use('/onboarding',onboardingRouter);

export default apiRouter;
