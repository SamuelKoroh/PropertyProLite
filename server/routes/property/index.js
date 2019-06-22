import express from 'express';
import authenticate from '../../middleware/authenticate';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('proprty');
});

export default router;
