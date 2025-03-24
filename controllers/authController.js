import User from "../models/User.js";

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.redirect("/");
        } else {
            res.send("Invalid email or password!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

async function signupUser (req, res) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists! Try logging in.");
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        console.log("✅ User saved in MongoDB:", newUser);

        res.redirect("/");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Server Error");
    }
};

export {loginUser, signupUser};
