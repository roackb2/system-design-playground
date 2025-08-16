import app from './app'
import logger from './lib/logger';

const port = process.env.PORT || 3300

logger.info(`Server listening on ${port}`)
app.listen(port);
