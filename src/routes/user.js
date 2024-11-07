const express = require("express")
const router = express.Router()
const { loginWithEmail } = require("../controllers/user")

router
    .post('/login', loginWithEmail)




module.exports = router