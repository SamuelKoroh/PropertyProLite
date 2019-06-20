import express from 'express';
import User from '../../controllers/users';

const router = express();
const person = new User();

router.get('/', person.getUsers);

export default router;
