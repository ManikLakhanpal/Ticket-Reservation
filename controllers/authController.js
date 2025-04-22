import User from "../models/user.js";

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.PROD == true ? true : false,
      sameSite: process.env.PROD == true ? "None" : "Lax",
      maxAge: 3 * 60 * 60 * 1000, // * 3 hours
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);

    if (
      error.message == "Email is invalid" ||
      error.message == "Wrong password entered"
    ) {
      return res.status(401).send("Invalid email or password!");
    }

    res.status(500).send("Server Error");
  }
}

async function signupUser(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User already exists! Try logging in.");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = await newUser.generateAuthToken();

    console.log("✅ User saved in MongoDB:", newUser);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.PROD == true ? true : false,
      sameSite: process.env.PROD == true ? "None" : "Lax",
      maxAge: 3 * 60 * 60 * 1000, // * 3 hours
    });

    res.redirect("/");
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send("Server Error");
  }
}

export { loginUser, signupUser };
