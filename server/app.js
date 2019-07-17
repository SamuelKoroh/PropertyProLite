import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import swaggerDocument from './doc/swagger.json';
import routes from './routes';
import './config/cloudinary';

const app = express();

app.use(helmet());

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
