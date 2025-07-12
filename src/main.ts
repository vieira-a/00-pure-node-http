import { createServer } from 'http';
import { envConfig } from './configs/env-config';
import { routerHandler } from './router-handler';

const port = envConfig.application.PORT;

const server = createServer(routerHandler);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
