import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middlewares/errorHandler.js';

export async function listExamples(_req, res, next) {
  try {
    const examples = await prisma.example.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(examples);
  } catch (err) {
    next(err);
  }
}

export async function createExample(req, res, next) {
  try {
    const example = await prisma.example.create({ data: req.body });
    res.status(201).json(example);
  } catch (err) {
    next(err);
  }
}

export async function getExample(req, res, next) {
  try {
    const example = await prisma.example.findUnique({ where: { id: req.params.id } });
    if (!example) throw new ApiError(404, 'Example no encontrado');
    res.json(example);
  } catch (err) {
    next(err);
  }
}

export async function deleteExample(req, res, next) {
  try {
    await prisma.example.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
