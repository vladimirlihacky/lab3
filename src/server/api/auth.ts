import { Strategy } from "passport-jwt"
import passport from "passport"
import config from "../../common/config"
import { User } from "../models/user"
import { Router, type NextFunction, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { Role } from "../../common/types"

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.server.authSecret,
}

passport.use(new Strategy(options, async (payload, done) => {
    try {
        const user = await User.getById(payload.id);

        if (user) {
            return done(null, user)
        }

        return done(null, false)
    } catch (err) {
        return done(err, false)
    }
}))

const router = Router()

router.post('/register', async (req, res) => {
    const body = req.body;

    if (!User.validate(body)) return res.status(400).json({ message: "Invalid registration data" })

    const password = await bcrypt.hash(body.password, 10);


    return res.status(201).json(await User.create({ ...body, password }));
})

router.post('/login', async (req, res) => {
    const body = req.body;

    const user = await User.findOne(({ email }) => email === body.email);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    console.log('Login: ', JSON.stringify(user))

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.server.authSecret,
        { expiresIn: '24h' }
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // В продакшене должно быть true (HTTPS)
        maxAge: 36000000 // 1 час
    });


    return res.json({ message: "Success" });
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out' });
});

export const requireRole = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('Require role:', req.user);
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (role === req.user?.role) {
            next();
        } else {
            res.status(403).json({
                message: 'Insufficient permissions',
                required: role,
                current: req.user?.role
            });
        }
    };
};

export { router as authRouter }