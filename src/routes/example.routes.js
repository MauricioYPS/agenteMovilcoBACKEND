import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createExampleSchema, idParamSchema } from '../validators/example.validator.js';
import {
  listExamples,
  createExample,
  getExample,
  deleteExample,
} from '../controllers/example.controller.js';

const router = Router();

router.get('/', listExamples);
router.post('/', validate({ body: createExampleSchema }), createExample);
router.get('/:id', validate({ params: idParamSchema }), getExample);
router.delete('/:id', validate({ params: idParamSchema }), deleteExample);

export default router;
