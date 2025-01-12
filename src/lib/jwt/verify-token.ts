import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

function verifyToken(req: NextRequest) {
    const token = req.cookies.get("next-auth.session-token");

    if (token) {
        const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET!);
        (req as any).user = decoded; // Attach user to request
        return true;
    } else {
        return false;
    }
}

export default verifyToken;
