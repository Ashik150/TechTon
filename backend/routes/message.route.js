import express from 'express';
import { createMessage, getMessages } from '../controllers/message.controller.js';
const router = express.Router();

router.post('/create-new-message', createMessage);
router.get('/get-all-messages/:id', getMessages);

export default router;