const express = require("express")
const { signinAdmin, signupAdmin, getOne, getAll, update, signupClient, signinClientAuth } = require("./controller")
const { authenticateUser, authorizeRoles } = require("../../../middlewares/auth")
const router = express()

router.post ("/auth/admin/signin", signinAdmin)
router.post ("/auth/admin/signup", signupAdmin)
router.post ("/auth/client/signin", signinClientAuth)
router.post ("/auth/client/signup", signupClient)

router.put ("/users/:id", authenticateUser, authorizeRoles("admin"), update)
router.get ("/users/:id", authenticateUser, authorizeRoles("admin"), getOne)
router.get ("/users", authenticateUser, authorizeRoles("admin"), getAll)

module.exports = router
