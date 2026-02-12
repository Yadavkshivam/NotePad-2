import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getNotes, createNote, deleteNote, updateNote } from '../controllers/noteController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
