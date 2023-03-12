const {
  registerUser,
  loginUser,
  deleteUser,
  updateMobile,
  socialLogin,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", auth, deleteUser);
router.post("/updatedetails", auth, updateMobile);
router.post("/sociallogin", socialLogin);

module.exports = router;
