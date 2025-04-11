import jwt from "jsonwebtoken";

async function auth(req, res, next) {
    try {

        let token;

        if (req.header('Authorization')) {
            token = req.header('Authorization').replace('Bearer ', '');
        } else if (req.cookies.auth_token) {
            token = req.cookies.auth_token;
        } else {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.ENCRYPTION_SECRET);

        if (!decoded._id) {
            throw new Error('Invalid token'); 
        }

        const user = decoded._id
        
        if (!user) {
            res.redirect('/login')
        }

        req.token = token;
        req.user = user;

        next();
        
    } catch (e) {
        return res.redirect("/login")
    }
}

export default auth;