import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import swaggerDocument from './doc/swagger.json';
import routes from './routes';
import './config/cloudinary';
import Database from './db/index';

const db = new Database();
const app = express();

app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    res.send(rows);
  } catch (error) {
    res.send(error);
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
