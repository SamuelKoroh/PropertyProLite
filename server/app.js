import express from 'express';
import 'dotenv/config';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

export default app;
