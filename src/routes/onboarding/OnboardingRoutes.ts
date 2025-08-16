import  { Router } from 'express';
import { OnboardingController } from '@/controllers/OnboardingController';
import { QueuePort } from '@/infra/queue/QueuePort';

export const getOnboardingRouter = (queue: QueuePort) => {
  const onboardingRouter = Router();

  const onboardingController = new OnboardingController(queue);

  onboardingRouter.post('/submit', onboardingController.handleApplicationSubmit.bind(onboardingController));

  return onboardingRouter
}

