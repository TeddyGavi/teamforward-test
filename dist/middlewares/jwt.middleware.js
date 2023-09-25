import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    const token = jwt
        .verify(req.cookies['jwt-token'], (process.env.SecretKeyOne ??= ''))
        .toString();
    if (!token) {
        return res
            .status(401)
            .json({ verified: false, message: 'Token not provided' });
    }
    jwt.verify(token, process.env.SecretKeyOne, (err, payload) => {
        if (err) {
            console.error(err);
            res
                .status(401)
                .json({ verified: false, message: 'token verification failed' });
        }
        else {
            req.userId = payload.id;
            next();
        }
    });
};
//# sourceMappingURL=jwt.middleware.js.map