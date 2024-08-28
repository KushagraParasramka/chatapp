import { Router } from "express";
import {
    chatAccess,
    requestFriend,
    addFriend,
    searchUser,
    allChats
} from "../controller/chat.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/allchats").get(verifyJWT,allChats);
router.route("/chataccess").post(verifyJWT, chatAccess);
router.route("/addfriend").post(verifyJWT,addFriend);
router.route("/search").post(verifyJWT,searchUser);
router.route("/requestfriend").post(verifyJWT,requestFriend);


export default router
