import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import axios from "axios";
import ErrorHandler from "../middleware/ErrorHandler";
import { ILegalInfo, IUser } from "../types/user.type";

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

export const getAccessToken = async (code: string, redirect_uri: string) => {
  console.log("code service", code);
  const clientId = process.env.ONE_ID_CLIENT_ID;
  const clientSecret = process.env.ONE_ID_CLIENT_SECRET;

  const response = await axios.post(
    "https://sso.egov.uz/sso/oauth/Authorization.do",
    null,
    {
      params: {
        grant_type: "one_authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri,
      },
    }
  );

  if (response.data.error) {
    throw new ErrorHandler(response.data.message, 400);
  }

  return response.data;
};

export const getUserData = async (accessToken: string) => {
  const clientId = process.env.ONE_ID_CLIENT_ID;
  const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
  const scope = process.env.ONE_ID_SCOPE;

  const response = await axios.post(
    "https://sso.egov.uz/sso/oauth/Authorization.do",
    null,
    {
      params: {
        grant_type: "one_access_token_identify",
        client_id: clientId,
        client_secret: clientSecret,
        access_token: accessToken,
        scope: scope,
      },
    }
  );

  if (response.data.error) {
    throw new ErrorHandler(response.data.error.message, 400);
  }

  return response.data;
};

export const findOrCreateUser = async (data: any) => {
  const findUser = await prisma.user.findUnique({
    where: {
      pin_jshshir: data.pin,
    },
    include: {
      legal_info: true,
      Contract: true,
    },
  });

  if (!findUser) {
    const basicLegalInfo = data.legal_info.find((info: any) => info.is_basic === true);
    const legalDataToCreate = basicLegalInfo
      ? {
          create: {
            name: basicLegalInfo.acron_UZ,
            le_name: basicLegalInfo.le_name,
            inn: basicLegalInfo.le_tin,
            tin: basicLegalInfo.tin,
          },
        }
      : undefined;

    const user = await prisma.user.create({
      data: {
        pin_jshshir: data.pin,
        user_id: data.user_id,
        user_type: data.user_type,
        valid: Boolean(data.valid),
        passport_no: data.pport_no,
        birth_date: data.birth_date,
        birth_place: data.birth_place,
        first_name: data.first_name,
        full_name: data.full_name,
        legal_info: legalDataToCreate,
        is_LLC: Boolean(basicLegalInfo),
        sur_name: data.sur_name,
        middle_name: data.mid_name,
      },
      include: {
        legal_info: true,
        Device: true,
      },
    });

    return user;
  } else {
    const basicLegalInfo = data.legal_info.find((info: any) => info.is_basic === true);

    if (findUser.legal_info && basicLegalInfo) {
      await prisma.legalInfo.update({
        where: {
          id: findUser.legal_info.id,
        },
        data: {
          name: basicLegalInfo.acron_UZ,
          le_name: basicLegalInfo.le_name,
          inn: basicLegalInfo.le_tin,
          tin: basicLegalInfo.tin,
        },
      });
    } else if (findUser.legal_info && !basicLegalInfo) {
      await prisma.user.update({
        where: {
          pin_jshshir: data.pin,
        },
        data: {
          is_LLC: false,
        },
      });
    }

    return await prisma.user.findUnique({
      where: {
        id: findUser.id,
      },
      include: {
        legal_info: true,
        Device: true,
      },
    });
  }
};

export const findOrCreateDevice = async (user: IUser, ip: string, ua: any) => {
  const findDevice = await prisma.device.findFirst({
    where: {
      ip: ip || "",
      browser: ua.browser || "",
      os: ua.os || "",
      device: ua.platform || "",
      userId: user.id,
    },
  });

  if (!findDevice) {
    await prisma.device.create({
      data: {
        ip: ip || "",
        browser: ua.browser || "",
        os: ua.os || "",
        device: ua.platform || "",
        userId: user.id,
      },
    });
  }
};


export const getUserById = async (userId: string): Promise<IUser | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      legal_info: true,
      Device: true,
    },
  });

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  return user as IUser;
};

export const updateUserLegalInfo = async (
  userId: string,
  legalInfoData: Partial<ILegalInfo>
): Promise<ILegalInfo> => {
  const updatedLegalInfo = await prisma.legalInfo.update({
    where: {
      userId: userId,
    },
    data: legalInfoData as any,
  });

  return updatedLegalInfo as ILegalInfo;
};

export const updateUser = async (
  userId: string,
  userData: Partial<IUser>
): Promise<IUser> => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: userData as any,
    include: {
      legal_info: true,
    },
  });

  return updatedUser as IUser;
};