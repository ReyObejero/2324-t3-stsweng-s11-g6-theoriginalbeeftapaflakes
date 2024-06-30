import { app } from './app';
import { env } from './config';

const { PORT, HOSTNAME } = env.server;

app.listen(PORT, HOSTNAME, () => {
    console.info(`Server is running on http://${HOSTNAME}:${PORT}`);
});
