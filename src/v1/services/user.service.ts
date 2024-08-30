import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

// export async function signAccessToken(userId: string) {
//   return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
//     expiresIn: "5m",
//   });
// }

// export async function signRefreshToken(userId: string) {
//   return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
//     expiresIn: "3d",
//   });
// }

// export async function comparePassword(
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   return bcrypt.compare(plainPassword, hashedPassword);
// }

export async function findUserDeviceService(
  device_id: string,
  user_id: string | undefined
) {
  return await prisma.device.findFirst({
    where: {
      id: device_id,
      userId: user_id,
    },
  });
}
export async function deleteUserDeviceService(
  device_id: string,
  user_id: string | undefined
) {
  return await prisma.device.delete({
    where: {
      id: device_id,
      userId: user_id,
    },
  });
}
