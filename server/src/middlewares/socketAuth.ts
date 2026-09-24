import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import redis from "../utils/redis";

interface IDecoded extends JwtPayload {
  id: string;
}
export const authenticationSocket = async (
  socket: Socket,
  next: (error?: Error) => void,
) => {
  try {
    // get accessToken from cookie to check it
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Not authenticated"));
    }
    // destruct accessToken
    // cookie will be like : access_token=abc123; refresh_token=xyz456
    const accessToken = cookieHeader
      .split(";")
      .find((cookie) => cookie.trim().startsWith("access_token="))
      ?.split("=")[1];
    if (!accessToken) {
      return next(new Error("Not authenticated"));
    }
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as IDecoded;
    if (!decoded?.id) {
      return next(new Error("Invalid token"));
    }
    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new Error("Session expired"));
    }
    socket.data.user = JSON.parse(session);
    next();
  } catch (error) {
    next(new Error("Not authenticated"));
  }
};
