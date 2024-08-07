const express = require("express")
const router = express()
const { create, index, find, update, destroy } = require("./controller")
const { authenticateUser, authorizeRoles } = require("../../../middlewares/auth")

router.post ("/rewards", authenticateUser, authorizeRoles("admin"), create)
router.put ("/rewards/:id", authenticateUser, authorizeRoles("admin"), update)
router.delete ("/rewards/:id", authenticateUser, authorizeRoles("admin"), destroy)
router.get ("/rewards", index)
router.get ("/rewards/:id", find)

module.exports = router
