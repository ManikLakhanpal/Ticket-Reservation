import User from "../models/User.js";

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        if (user) {
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: (process.env.PROD == true) ? true : false, 
                sameSite: 'None',
                maxAge: 3 * 60 * 60 * 1000 // * 3 hours
            });

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
        const token = await user.generateAuthToken();

        console.log("✅ User saved in MongoDB:", newUser);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: (process.env.PROD == true) ? true : false, 
            sameSite: 'None',
            maxAge: 3 * 60 * 60 * 1000 // * 3 hours
        });
        res.redirect("/");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Server Error");
    }
};

export {loginUser, signupUser};
