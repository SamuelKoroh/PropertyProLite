import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import swaggerDocument from './doc/swagger.json';
import routes from './routes';
import './config/cloudinary';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Server listening on ${port}`));
