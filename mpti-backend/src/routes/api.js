import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import customerController from "../controller/customer-controller.js";
import gasController from "../controller/gas-controller.js";
import multer from "multer"
import { ResponseError } from "../error/response-error.js";
import fileUpload from "express-fileupload";
import path from "path";
import url from 'url';

const diskStorage = multer.diskStorage({
    destination: "/images"
})

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.use(express.static(__dirname.split("\\").slice(0, -1).join("\\") + "\\images"))
userRouter.all("/", userController.cekUser)
userRouter.delete("/user/logout", userController.logout)

userRouter.post("/customer/nik", customerController.cekNik)
userRouter.get("/customer", customerController.customerType)
userRouter.post("/customer", fileUpload({
  limits: {
    fileSize: 1000000
  },
  abortOnLimit: true,
  limitHandler: (req, res)=>{
    
    res.status(413).json({
      errors: "File terlalu besar"
    })
  }
}),customerController.register)

userRouter.post("/gas/add", gasController.add)
userRouter.post("/transaction", gasController.transaction)
userRouter.post("/gas/retur", gasController.retur)
userRouter.post("/gas/update", gasController.update)
userRouter.get("/gas/stok", gasController.stok)
userRouter.delete("/gas/stok/:id", gasController.deleteStok)
userRouter.get("/gas/send", gasController.history)
userRouter.get("/gas/send/download", gasController.printHistory)
userRouter.get("/gas/sales", gasController.saleshistory)
userRouter.get("/gas/sales/download", gasController.printSalesHistory)
export {
    userRouter
}