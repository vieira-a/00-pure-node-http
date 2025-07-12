import { HealthController } from '../../controllers/health.controller';
import { IncomingMessage, ServerResponse } from 'http';
import { HttpMethod } from '../../enums';
import { envConfig } from '../../configs/env-config';

const API_PREFIX = envConfig.application.API_PREFIX;

export function healthRouter(controller: HealthController) {
  return (req: IncomingMessage, res: ServerResponse): boolean => {
    const healthUrl = `${API_PREFIX}/health`;
    const getHealthCheck = HttpMethod.GET;

    if (req.method === getHealthCheck && req.url === healthUrl) {
      controller.heathCheck(req, res);
      return true;
    }

    return false;
  };
}
