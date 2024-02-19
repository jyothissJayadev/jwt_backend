import { Router } from "express"; 
const router=Router();
import * as controller from  '../controller/control.js'


// **POST**
router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
// **GET**


router.route('/user/:email').get(controller.getUser);

// **PUT**


// router.route('/updateuser').put(Auth,controller.updateUser);

export default router
