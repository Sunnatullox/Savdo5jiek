import fs from "fs";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import {
  addBusinessDays,
  createContractService,
  getContractsByIdService,
  getContractsByAdminService,
  updateContractService,
  getContractByIdService,
  newNotifsContractisAdmin,
  getContractByTaxAgentService,
} from "../services/contract.service";
import prisma from "../config/db";
import uniqid from "uniqid";
import { htmlToPDFAndSave } from "../utils/fileReplace";
import UzFqContractHtml from "../data/contracts/uz/uz_fq";
import UzTshContractHtml from "../data/contracts/uz/uz_tsh";
import { numberToWordsRu, numberToWordsUz } from "../utils/numberToWords";
import RuFqContractHtml from "../data/contracts/ru/ru_fq";
import RuTshContractHtml from "../data/contracts/ru/ru_tsh";
import { qrCodeGenerator } from "../utils/fileUpload";
import { AdminInfo, Administrator } from "../types/adminstrator.type";
import { ILegalInfo, IUser } from "../types/user.type";
import { IPayment } from "../types/payment.type";
import { IContract } from "../types/contract.type";
import { deletePayment } from "../services/payment.service";
import { deleteMessageAdminService } from "../services/messages.service";

export const createContractByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Please login to create a contract", 401));
      }

      const { id } = req.user;
      const { products, totalPrice, isDelivery } = req.body;

      if (!products.length || !totalPrice) {
        return next(new ErrorHandler("All fields are required", 400));
      }
      
      const findsProducts = await prisma.product.findMany({
        where: { id: { in: products.map((product) => product.id) } },
        include: { category: true },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Check if requested quantity exceeds available stock
      const productsWithQty = products
        .map((product) => {
          const foundProduct = findsProducts.find((p) => p.id === product.id);
          if (foundProduct) {
            if (product.qty > foundProduct.stock) {
              return next(
                new ErrorHandler(
                  `Requested quantity for product ${foundProduct.name_uz} exceeds available stock`,
                  400
                )
              );
            }
            return { ...foundProduct, qty: product.qty };
          }
        })
        .filter(Boolean);

      if (findsProducts.length !== products.length) {
        return next(
          new ErrorHandler("Please select the correct products", 404)
        );
      }

      const findAdmin = (await prisma.administration.findFirst({
        where: { role: "ADMIN", AdminInfo:{isNot:null} },
        include: { AdminInfo: true }
      })) as unknown as Administrator & { AdminInfo: AdminInfo };
      if (!findAdmin) {
        return next(new ErrorHandler("Admin not found", 404));
      }

      const findUser = (await prisma.user.findFirst({
        where: { id },
        include: { legal_info: true },
      })) as unknown as IUser & { legal_info: ILegalInfo };
      if (!findUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const contract_id = uniqid.time() + "-uz";
      const now = new Date();
      const formattedDate = now
        .toLocaleDateString("en-GB")
        .split("/")
        .join(".");
      const deliveryDate = new Date(now.setMonth(now.getMonth() + 1));
      const formattedDeliveryDate = deliveryDate
        .toLocaleDateString("en-GB")
        .split("/")
        .join(".");
      const contractEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const formattedContractEndDate = contractEndDate
        .toLocaleDateString("en-GB")
        .split("/")
        .join(".");

      const writtenTotalPriceRu = numberToWordsRu(totalPrice);
      const writtenTotalPriceUz = numberToWordsUz(Number(totalPrice));

      const fileNameUz = `document-${Date.now()}-uz.pdf`;
      const fileNameRu = `document-${Date.now()}-ru.pdf`;
      const qrCodeFileUz = await qrCodeGenerator(
        `${req.protocol}://${req.get("host")}/public/contracts/uz/${fileNameUz}`
      );
      const qrCodeFileRu = await qrCodeGenerator(
        `${req.protocol}://${req.get("host")}/public/contracts/ru/${fileNameRu}`
      );

      const contractFile = {
        contractFileUz: !findUser.is_LLC
          ? `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await UzFqContractHtml(
                findAdmin,
                findUser,
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryUz: findsProducts
                    .map((p) => p.category.name_uz)
                    .join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceUz,
                  contractEndDate: formattedContractEndDate,
                  qrcode: qrCodeFileUz,
                }
              ),
              "uz",
              fileNameUz
            ))
          : `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await UzTshContractHtml(
                findAdmin,
                findUser,
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryUz: findsProducts
                    .map((p) => p.category.name_uz)
                    .join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceUz,
                  contractEndDate: formattedContractEndDate,
                  qrcode: qrCodeFileUz,
                }
              ),
              "uz",
              fileNameUz
            )),
        contractFileRu: !findUser.is_LLC
          ? `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await RuFqContractHtml(
                findAdmin,
                findUser,
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryRu: findsProducts
                    .map((p) => p.category.name_ru)
                    .join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceRu,
                  contractEndDate: formattedContractEndDate,
                  qrcode: qrCodeFileRu,
                }
              ),
              "ru",
              fileNameRu
            ))
          : `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await RuTshContractHtml(
                findAdmin,
                findUser,
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryRu: findsProducts
                    .map((p) => p.category.name_ru)
                    .join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceRu,
                  contractEndDate: formattedContractEndDate,
                  qrcode: qrCodeFileRu,
                }
              ),
              "ru",
              fileNameRu
            )),
      };

      const newContract = await createContractService({
        contract_id,
        User: { connect: { id } },
        products: productsWithQty as any,
        totalPrice,
        contractFile: contractFile as any,
        deliveryFile: "",
        shippingAddress: findUser.is_LLC
          ? findUser.legal_info.address
          : findUser.address,
        isDelivery,
        paymentEndDate: await addBusinessDays(new Date(), 7),
        contractEndDate: formattedContractEndDate,
        deliveryDate: formattedDeliveryDate,
        is_LLC: findUser.is_LLC,
      });

      res.status(201).json({
        success: true,
        message: "Contract created successfully",
        newContract,
      });
    } catch (error: any) {
      console.log("Contract error", error);
      return next(
        new ErrorHandler(`Error creating contract: ${error.message}`, 500)
      );
    }
  }
);

export const getContractsListByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, is_LLC } = req.user as IUser;
      const contract = await getContractsByIdService(id, is_LLC);
      res.status(200).json({
        success: true,
        message: "Contract list fetched successfully",
        contract,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Something went wrong: ${error.message}`, 500));
    }
  }
);

export const getContractsByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = await getContractsByAdminService();
      res.status(200).json({
        success: true,
        message: "Contracts fetched successfully",
        contracts,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting contracts: ${error.message}`, 500)
      );
    }
  }
);

export const getContractByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const contract = await getContractByIdService(id);
      if (!contract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Contract fetched successfully",
        contract,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting contract: ${error.message}`, 500)
      );
    }
  }
);

export const updateContractByAdminStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const findContract = (await getContractByIdService(
        id
      )) as unknown as IContract & {
        User: IUser & { legal_info: ILegalInfo };
      };
      if (!findContract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      if (findContract.status === status) {
        return next(
          new ErrorHandler("Contract status is already updated", 400)
        );
      }

      const contract = await updateContractService(id, { status });
      res.status(200).json({
        success: true,
        message: "Contract status updated successfully",
        contract,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error updating contract status: ${error.message}`,
          500
        )
      );
    }
  }
);

export const deleteContractByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Contract ID

    try {
      // Transaction start
      await prisma.$transaction(async (prisma) => {
        const contract = await prisma.contract.findUnique({
          where: { id },
          include: {
            Payment: true,
            Message: true,
          },
        });

        if (!contract) {
          throw new ErrorHandler("Contract not found", 404);
        }

        // Check if any payment is approved
        const approvedPaymentExists = contract.Payment.some(
          (payment) => payment.status === "approved"
        );

        if (approvedPaymentExists) {
          throw new ErrorHandler("Contract payment is approved", 400);
        }

        // Delete payments
        for (const payment of contract.Payment) {
          await deleteFile(payment.receiptImage as string);
          await deletePayment(payment.id);
        }

        // Delete messages
        for (const message of contract.Message) {
          await deleteMessageAdminService(message.id);
        }

        // Delete contract files
        async function deleteFile (fileUrl: string) {
          const url = new URL(fileUrl);
          const filePath = `.${url.pathname}`;
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath).catch((err) => {
              throw err;
            });
          }
        };
        const contractFile = contract.contractFile as any;
        if (contractFile) {
          if (contractFile.contractFileUz) {
            await deleteFile(contractFile.contractFileUz as string);
          }
          if (contractFile.contractFileRu) {
            await deleteFile(contractFile.contractFileRu as string);
          }
        }

        // Finally, delete the contract
        await prisma.contract.delete({
          where: { id },
        });
      });

      res.status(200).json({
        success: true,
        message: "Contract deleted successfully",
      });
    } catch (error: any) {
      console.log("Error deleting contract", error);  
      next(new ErrorHandler(`Error deleting contract: ${error.message}`, 500));
    }
  }
);

export const newNotificationsContractisAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts =
        (await newNotifsContractisAdmin()) as unknown as (IContract & {
          User: IUser;
        })[];
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        contracts,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error creating notification: ${error.message}`, 500)
      );
    }
  }
);

export const getContractById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!req.user) {
        return next(new ErrorHandler("Please login to get a contract", 401));
      }
      const contract = (await getContractByIdService(
        id,
        req.user.id
      )) as unknown as IContract & {
        User: IUser;
        Payment: IPayment[];
      };
      if (!contract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      if (!contract.isRead) {
        await updateContractService(id, { isRead: true });
      }

      res.status(200).json({
        success: true,
        message: "Contract fetched successfully",
        contract,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Error getting contract: ${error.message}`, 500));
    }
  }
);

export const getContractsByTaxAgent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = await getContractByTaxAgentService({
        where: { status: "approved" },
        include:{
          User:true
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json({
        success: true,
        message: "Contracts fetched successfully",
        contracts,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting contracts: ${error.message}`, 500)
      );
    }
  }
);

export const uploadContractDeliveryDoc = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const contract_delivery_doc = req.file as Express.Multer.File;

      const findContract = await getContractByIdService(id);
      if (!findContract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      const contract_delivery_doc_path = `${req.protocol}://${req.get(
        "host"
      )}/public/contracts/contract_delivery_doc/${contract_delivery_doc.filename}`;

      if(findContract.deliveryFile) {
        const url = new URL(findContract.deliveryFile as string);
        const filePath = `.${url.pathname}`;
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath).catch((err) => {
            throw err;
          });
        }
      }

      const contract = await updateContractService(id, {
        deliveryFile: contract_delivery_doc_path as any,
      });

      res.status(200).json({
        success: true,
        message: "Contract delivery document uploaded successfully",
        contract,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(
          `Error uploading contract delivery document: ${error.message}`,
          500
        )
      );
    }
  }
);
