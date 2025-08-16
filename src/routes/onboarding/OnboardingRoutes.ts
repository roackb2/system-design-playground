import  { Router } from 'express';
import { OnboardingController } from '@/controllers/OnboardingController';

const onboardingRouter = Router();

onboardingRouter.post('/submit', OnboardingController.handleApplicationSubmit.bind(OnboardingController));

export default onboardingRouter
