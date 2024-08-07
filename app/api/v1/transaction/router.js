const express = require("express")
const router = express()
const { create, index, find, createReward} = require("./controller")
const { authenticateUser, authorizeRoles, authenticateClient } = require("../../../middlewares/auth")

router.post ("/transactions", authenticateClient, authorizeRoles("client"), create)
router.post ("/reward", authenticateClient, authorizeRoles("client"), createReward)
router.get ("/transactions", authenticateUser, authorizeRoles("merchant", "admin"), index)
router.get ("/transactions/:id", authenticateUser, authorizeRoles("merchant", "admin"), find)

module.exports = router
