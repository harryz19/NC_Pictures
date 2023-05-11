const {
  registerUser,
  loginUser,
  deleteUser,
  updateMobile,
  socialLogin,
  activateAccount,
  forgotPassword,
  resetPassword,
  getAllPhotographers,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/activate", activateAccount);
router.post("/login", loginUser);
router.delete("/delete", auth, deleteUser);
router.post("/updatedetails", auth, updateMobile);
router.post("/sociallogin", socialLogin);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.get("/allphotographers", auth, getAllPhotographers);

module.exports = router;
