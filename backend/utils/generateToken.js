import jwt from 'jsonwebtoken'; 

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // prevents client side JS from accessing the cookie
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'production',
    };
    
    console.log("Token generated and cookie set: ", token);
    res.cookie('jwt', token, cookieOptions);
}; 

export default generateTokenAndSetCookie;