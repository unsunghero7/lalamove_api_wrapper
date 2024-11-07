
const User = require("../database/models/user")
const {generateNewToken}=require("../middleware")

const addAdmin=async()=>{
    const data=await User.create({
        full_name:"admin",
        email: "admin@gmail.com",
        password: "W^LOI}.MG!oz"
    })
    console.log(data)
}



module.exports = {

    loginWithEmail: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).send({
                    success:false,
                    message:"User not found"
                })
            }

            const valid_pass = await user.passowrdCheck(password)
            if (!valid_pass) {
                return res.status(400).send({ status: false, code: 400, message: "invalid password" });
            }

            const token = generateNewToken(user)

            let user_data = {
                _id: user._id, token: token, email: user.email
            }

            res.send({
                success:true,
                message:"User has been logged in",
                data:user_data
            })
        } catch (e) {
            next(e)
        }
    }
}