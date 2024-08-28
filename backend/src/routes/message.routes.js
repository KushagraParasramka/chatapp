import { Router } from "express";
import {
    sendMessage
} from "../controller/message.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/sendmessage").post(verifyJWT,sendMessage);


export default router
