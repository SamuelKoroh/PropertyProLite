import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import routes from './routes';
import './config/cloudinary';

const app = express();

app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

export default app;
