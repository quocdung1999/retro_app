const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const auth = require("../middlewares/auth.js");
router.get("/test", (req, res) => {
    res.send("Hello, it's working");
});

router.post('/changeDisplayName', async (req,res) => {
    try {
        const {userId,displayName} = req.body;
        const update = {displayName:displayName};
        await User.findByIdAndUpdate(userId,update,(error,updatedUser) => {
            res.json(updatedUser);
        });
    }
    catch (err)
    {
        console.log(err.message);
    }
})
router.post("/register", async (req, res) => {
    try {
        let {email,password,passwordCheck,displayName} = req.body;
        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields has been entered" });

        if (password.length < 5)
            return res.status(400).json({
                msg: "The password needs to be at least 5 characters long",
            })


        if (password !== passwordCheck)
            return res.status(400).json({
                msg: "Enter the same password twice for verification",
            })

        const existingUser = await User.findOne({
            email: email,
        })

        if (existingUser)
            return res.status(400).json({
                msg: "An account with this email already exists",
                user: existingUser,
            })

        if (!displayName)
            displayName = email;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });
        const saveUser = await newUser.save();
        res.json(saveUser);
        console.log("Register!!");
    } catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields has been entered" });

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({
                msg: "No account with this email has been registered",
            })

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({
                msg: "Invalid credentials",
            })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
            }
        })

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.delete("/delete", auth, async (req, res) => {
    //console.log(req.user);

    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.json(false); 
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        })
    }
});

router.get("/",auth,async (req,res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName:user.displayName,
        id:user._id,
    });
});
module.exports = router;