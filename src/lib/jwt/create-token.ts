import jwt from "jsonwebtoken";

function createToken(payload: any) {
    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
        expiresIn: "7d",
    });

    return token;
}

export default createToken;
