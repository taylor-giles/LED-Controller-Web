import * as express from "express";
import { generateNewDisplay, ensureId, setDisplay, setSavedColors, setSavedGradients, getConfig, getGuest } from "./controller";
const router = express.Router();

router.get('/getGuest', getGuest);
router.post('/generate', generateNewDisplay)
router.post('/setDisplay/:id', ensureId, setDisplay)
router.post('/setGradients/:id', ensureId, setSavedGradients)
router.post('/setColors/:id', ensureId, setSavedColors)
router.get('/config/:id', ensureId, getConfig)

export default router;