import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import protectedRoute from '../middlewares/protectRoute.js';
import { getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage); 

export default router;