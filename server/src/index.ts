import { APP } from './app';
import { ENV } from './config';

const { PORT, HOSTNAME } = ENV.server;

APP.listen(PORT, HOSTNAME, () => {
    console.info(`Server is running on http://${HOSTNAME}:${PORT}`);
});
