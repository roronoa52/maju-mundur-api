const express = require("express")
const router = express()
const { create, index, find, update, destroy } = require("./controller")
const { authenticateUser, authorizeRoles } = require("../../../middlewares/auth")

router.post ("/products", authenticateUser, authorizeRoles("merchant"), create)
router.put ("/products/:id", authenticateUser, authorizeRoles("merchant"), update)
router.delete ("/products/:id", authenticateUser, authorizeRoles("merchant"), destroy)
router.get ("/products", index)
router.get ("/products/:id", find)

module.exports = router
