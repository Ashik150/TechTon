import express from 'express';
import {createEvent,getEvents,deleteEvent, getAllEvents} from '../controllers/event.controller.js';
const router = express.Router();

router.post('/create-event',createEvent);
router.get('/get-all-events/:id',getEvents);
router.delete('/delete-shop-event/:id',deleteEvent);
router.get('/get-all-events',getAllEvents);

export default router;
