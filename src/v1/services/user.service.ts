import { User } from "@prisma/client";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import ErrorHandler from "../middleware/ErrorHandler";
import { ILegalInfo, IUser } from "../types/user.type";
import { IContract } from "../types/contract.type";
import { IPayment } from "../types/payment.type";

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

  const response = await fetch(
    "https://sso.egov.uz/sso/oauth/Authorization.do",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "one_authorization_code" as string,
        client_id: clientId as string,
        client_secret: clientSecret as string,
        code: code,
        redirect_uri: redirect_uri,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new ErrorHandler(data.message, 400);
  }

  return data;
};

export const getUserData = async (accessToken: string) => {
  const clientId = process.env.ONE_ID_CLIENT_ID;
  const clientSecret = process.env.ONE_ID_CLIENT_SECRET;
  const scope = process.env.ONE_ID_SCOPE;

  const response = await fetch(
    "https://sso.egov.uz/sso/oauth/Authorization.do",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "one_access_token_identify",
        client_id: clientId as string,
        client_secret: clientSecret as string,
        access_token: accessToken,
        scope: scope as string,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new ErrorHandler(data.error.message, 400);
  }

  return data;
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
    const basicLegalInfo = data.legal_info.find(
      (info: any) => info.is_basic === true
    );
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
    const basicLegalInfo = data.legal_info.find(
      (info: any) => info.is_basic === true
    );

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
      os: ua.os || "",
      device: ua.platform || "",
      userId: user.id,
    },
  });

  if (!findDevice && ip !== "::1") {
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

export const getAllUsersByAdminService = async () => {
  return await prisma.user.findMany({
    include: {
      legal_info: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const deleteUserService = async (userId: string) => {
  const transaction = await prisma.$transaction(async (tx) => {
    const findUser = await getUserById(userId);
    if (!findUser) {
      throw new ErrorHandler("User not found", 404);
    }

    const userContract = await tx.contract.findMany({
      where: {
        userId: userId,
        status: "approved",
      },
    });

    if (userContract.length > 0) {
      throw new ErrorHandler("User has an active contract", 400);
    }

    const userPayment = await tx.payment.findMany({
      where: {
        userId: userId,
        status: "approved",
      },
    });

    if (userPayment.length > 0) {
      throw new ErrorHandler("User has an active payment", 400);
    }

    const userContracts = await tx.contract.findMany({
      where: {
        userId: userId,
      },
    });

    for (const contract of userContracts) {
      const contractFile = contract?.contractFile as any;
      if (contractFile) {
        if (contractFile.contractFileUz) {
          await deleteFile(contractFile.contractFileUz as string);
        }
        if (contractFile.contractFileRu) {
          await deleteFile(contractFile.contractFileRu as string);
        }
      }
    }

    const userPayments = await tx.payment.findMany({
      where: {
        userId,
      },
    });

    for (const payment of userPayments) {
      const paymentFile = payment?.receiptImage as any;
      if (paymentFile) {
        await deleteFile(paymentFile as string);
      }
    }

    await tx.contract.deleteMany({
      where: {
        userId: userId,
      },
    });

    await tx.payment.deleteMany({
      where: {
        userId,
      },
    });

    await tx.message.deleteMany({
      where: {
        userId,
      },
    });

    await tx.device.deleteMany({
      where: {
        userId,
      },
    });

    await tx.legalInfo.delete({
      where: {
        userId,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });
  });

  return transaction;
};



async function deleteFile(fileUrl: string) {
  const url = new URL(fileUrl);
  const filePath = `.${url.pathname}`;
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath).catch((err) => {
      if (err === "ENOENT") {
        return;
      }
      throw err;
    });
  }
}
