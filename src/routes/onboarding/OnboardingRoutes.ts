import  { Router } from 'express';
import { OnboardingController } from '@/controllers/OnboardingController';
import { QueuePort } from '@/infra/queue/QueuePort';
import OnboardingRepository from '@/services/onboarding/OnboardingRepository';

export const getOnboardingRouter = (queue: QueuePort) => {
  const onboardingRouter = Router();

  // Dependencies
  const repository = new OnboardingRepository()

  // Controller
  const onboardingController = new OnboardingController({
    queue,
    repository
  });

  // Routes
  onboardingRouter.post('/submit', onboardingController.handleApplicationSubmit.bind(onboardingController));

  return onboardingRouter
}

