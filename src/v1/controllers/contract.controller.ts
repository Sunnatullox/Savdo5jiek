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
  deleteContractService,
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
import {
  AdminInfo,
  Administration,
  Contract,
  LegalInfo,
  Payment,
  User,
} from "@prisma/client";
import { IProduct } from "../types/product.type";

export const createContractByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Please login to create a contract", 401));
      }

      const { id } = req.user;
      const {
        products,
        totalPrice,
        isDelivery,
      }: {
        products: { id: string; qty: number }[];
        totalPrice: number;
        isDelivery: boolean;
      } = req.body;

      if (products.length === 0 || !totalPrice) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const findsProducts = await prisma.product.findMany({
        where: {
          id: { in: products.map((product) => product.id) },
        },
        include: {
          category: true,
        },
      });

      const productsWithQty: (IProduct & { qty: number })[] = [];
      for (const product of products) {
        const foundProduct = findsProducts.find((p) => p.id === product.id);
        if (foundProduct) {
          productsWithQty.push({ ...foundProduct, qty: product.qty } as IProduct & { qty: number });
        }
      }

      if (findsProducts.length !== products.length) {
        return next(
          new ErrorHandler("Please select the correct products", 404)
        );
      }

      const findAdmin = await prisma.administration.findFirst({
        where: {
          role: "ADMIN",
        },
        include: {
          AdminInfo: true,
        },
      });
      if (!findAdmin) {
        return next(new ErrorHandler("Admin not found", 404));
      }

      const findUser = await prisma.user.findFirst({
        where: {
          id,
        },
        include: {
          legal_info: true,
        },
      });
      if (!findUser) {
        return next(new ErrorHandler("User not found", 404));
      }
      if (productsWithQty.length === 0) {
        return next(
          new ErrorHandler("Please select the correct products", 404)
        );
      }
      const contract_id = uniqid("", "UZ");
      // now date
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      const formattedDate = `${day}.${month}.${year}`;

      const productsCategoryUz = await Promise.all(
        findsProducts.map(async (product) => await product.category.name_uz)
      );
      const productsCategoryRu = await Promise.all(
        findsProducts.map(async (product) => await product.category.name_ru)
      );

      // delivery date
      const deliveryDate = new Date(new Date().setMonth(now.getMonth() + 1));
      const deliveryDay = String(deliveryDate.getDate()).padStart(2, "0");
      const deliveryMonth = String(deliveryDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const deliveryYear = deliveryDate.getFullYear();

      const formattedDeliveryDate = `${deliveryDay}.${deliveryMonth}.${deliveryYear}`;

      const writtenTotalPriceRu = numberToWordsRu(totalPrice);
      const writtenTotalPriceUz = numberToWordsUz(Number(totalPrice));

      // contract end date
      const contractEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const contractEndDateDay = String(contractEndDate.getDate()).padStart(
        2,
        "0"
      );
      const contractEndDateMonth = String(
        contractEndDate.getMonth() + 1
      ).padStart(2, "0");
      const contractEndDateYear = contractEndDate.getFullYear();

      const formattedContractEndDate = `${contractEndDateDay}.${contractEndDateMonth}.${contractEndDateYear}`;

      const contractFile = {
        contractFileUz: !findUser.is_LLC
          ? `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await UzFqContractHtml(
                findAdmin as Administration & { AdminInfo: AdminInfo },
                findUser as User & { legal_info: LegalInfo },
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryUz: productsCategoryUz.join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceUz,
                  contractEndDate: formattedContractEndDate,
                }
              ),
              "uz"
            ))
          : `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await UzTshContractHtml(
                findAdmin as Administration & { AdminInfo: AdminInfo },
                findUser as User & { legal_info: LegalInfo },
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryUz: productsCategoryUz.join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceUz,
                  contractEndDate: formattedContractEndDate,
                }
              ),
              "uz"
            )),
        contractFileRu: !findUser.is_LLC
          ? `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await RuFqContractHtml(
                findAdmin as Administration & { AdminInfo: AdminInfo },
                findUser,
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryRu: productsCategoryRu.join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceRu,
                  contractEndDate: formattedContractEndDate,
                }
              ),
              "ru"
            ))
          : `${req.protocol}://${req.get("host")}/public` +
            (await htmlToPDFAndSave(
              await RuTshContractHtml(
                findAdmin as Administration & { AdminInfo: AdminInfo },
                findUser as User & { legal_info: LegalInfo },
                productsWithQty,
                isDelivery,
                {
                  contractId: contract_id,
                  contractDate: formattedDate,
                  productsCategoryRu: productsCategoryRu.join(", "),
                  totalPrice,
                  deliveryDate: formattedDeliveryDate,
                  writtenTotalPriceRu,
                  contractEndDate: formattedContractEndDate,
                }
              ),
              "ru"
            )),
      };

      const newContract = await createContractService({
        contract_id,
        User: { connect: { id } },
        products: productsWithQty as any,
        totalPrice: totalPrice,
        contractFile: contractFile as any,
        deliveryFile: "",
        shippingAddress: "",
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

export const getContractsByIdUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ErrorHandler("Please login to get a contract", 401));
      }
      const { id } = req.user;
      const contract = await getContractsByIdService(id, req.user.is_LLC);
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

export const updateContratcByAdminStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return next(new ErrorHandler("Status is required", 400));
      }

      const findContract = (await getContractByIdService(id)) as Contract & {
        User: User & { legal_info: LegalInfo };
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
    } catch (error: any) {}
  }
);

export const deleteContractByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const findContract = (await getContractByIdService(id)) as Contract & {
        User: User & { legal_info: LegalInfo };
        Payment: Payment[];
      };

      if (!findContract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      const findContactPaymentStatusApproved = findContract.Payment.some(
        (payment) => payment.status === "approved"
      );

      if (findContactPaymentStatusApproved) {
        return next(new ErrorHandler("Contract payment is approved", 400));
      }

      const contract = (await deleteContractService(id)) as any;

      if (contract?.contractFile?.contractFileUz) {
        const url_uz = new URL(contract?.contractFile?.contractFileUz);
        const filePath_uz = `.${url_uz.pathname}`;
        if (fs.existsSync(filePath_uz)) {
          fs.unlinkSync(filePath_uz);
        }
      }

      if (contract?.contractFile?.contractFileRu) {
        const url_ru = new URL(contract?.contractFile?.contractFileRu);
        const filePath_ru = `.${url_ru.pathname}`;
        if (fs.existsSync(filePath_ru)) {
          fs.unlinkSync(filePath_ru);
        }
      }

      if (contract?.deliveryFile?.deliveryFileUz) {
        const url_delivery = new URL(contract.deliveryFile.deliveryFileUz);
        const filePath_delivery = `.${url_delivery.pathname}`;
        if (fs.existsSync(filePath_delivery)) {
          fs.unlinkSync(filePath_delivery);
        }
      }

      if (contract?.deliveryFile?.deliveryFileRu) {
        const url_delivery = new URL(contract.deliveryFile.deliveryFileRu);
        const filePath_delivery = `.${url_delivery.pathname}`;
        if (fs.existsSync(filePath_delivery)) {
          fs.unlinkSync(filePath_delivery);
        }
      }

      res.status(200).json({
        success: true,
        message: "Contract deleted successfully",
        contract,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error deleting contract: ${error.message}`, 500)
      );
    }
  }
);

export const newNotificationsContractisAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = (await newNotifsContractisAdmin()) as (Contract & {
        User: User;
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
        req.user?.id
      )) as Contract & {
        User: User;
        Payment: Payment[];
      };
      if (!contract) {
        return next(new ErrorHandler("Contract not found", 404));
      }

      if (contract.isRead === false) {
        await updateContractService(id, { isRead: true });
      }

      res.status(200).json({
        success: true,
        message: "Contract fetched successfully",
        contract,
      });
    } catch (error: any) {}
  }
);

export const getContractsByTaxAgent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contracts = await getContractByTaxAgentService({
        where: {status: "approved"},
      });
      res.status(200).json({
        success: true,
        message: "Contracts fetched successfully",
        contracts,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting contract: ${error.message}`, 500)
      );
    }
  }
);
