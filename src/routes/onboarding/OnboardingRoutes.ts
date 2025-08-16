import { OnboardingApplicationSchema } from '@/services/onboarding/OnboardingApplication.types';
import logger from '@/lib/logger';
import { OnboardingService } from '@/services/onboarding/OnboardingService';
import  { Router } from 'express';

const onboardingRouter = Router();
const routeName = 'OnboardingRouter'

onboardingRouter.post('/submit', (req, res) => {
  logger.info(`${routeName}: Handle submit request: ${JSON.stringify(req.body)}`)

  const parseRes = OnboardingApplicationSchema.safeParse(req.body);

  if (!parseRes.success || !parseRes.data) {
    res.json({
      error: 'Invalid application',
      message: parseRes.error
    })
    return;
  }

  const result = OnboardingService.handleApplicationSubmit(parseRes.data)

  res.json(result);
});

export default onboardingRouter
