import { QueuePort } from '@/infra/queue/QueuePort';
import { Router } from "express";
import { getOnboardingRouter } from "./onboarding/OnboardingRoutes";

export const getApiRouter = ({
  queue
}: {
  queue: QueuePort
}) => {
  const apiRouter = Router();

  const onboardingRouter = getOnboardingRouter(queue);

  apiRouter.use('/onboarding',onboardingRouter);

  return apiRouter;
}

