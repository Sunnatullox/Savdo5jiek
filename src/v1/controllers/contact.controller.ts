import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../middleware/ErrorHandler";
import { createContactUs, deleteContactUs, getContactUs, getContactUsList, updateContactUs } from "../services/contact.servoce";

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const contactUs = await createContactUs({ name, email, phone, message });
    
    res.status(201).json({
      success: true,
      message: "Contact Us created successfully",
      contactUs,
    });
  } catch (error) {
    next(new ErrorHandler(`Something went wrong ${error}`, 500));
  }
};

export const getContactUsIsNotReadAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactUs = await getContactUsList({
            where: {
                isRead: false
            }
        })
        res.status(200).json({
            success: true,
            message: "Contact Us list fetched successfully",
            contactUs
        })
    } catch (error) {
        next(new ErrorHandler(`Something went wrong ${error}`, 500))
    }
}

export const getContactUsListAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactUs = await getContactUsList({where: {}})
        res.status(200).json({
            success: true,
            message: "Contact Us list fetched successfully",
            contactUs
        })
    } catch (error) {
        next(new ErrorHandler(`Something went wrong ${error}`, 500))
    }
}

export const getSingleContactUsAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const {id} = req.params
        if(!id) {
            return next(new ErrorHandler("Contact Us id is required", 400))
        }
        const contactUs = await getContactUs(id)
        if(!contactUs) {
            return next(new ErrorHandler("Contact Us not found", 404))
        }
        await updateContactUs(id, {isRead: true})

        res.status(200).json({
            success: true,
            message: "Contact Us fetched successfully",
            contactUs
        })
    } catch (error) {
        next(new ErrorHandler(`Something went wrong ${error}`, 500))
    }
}

export const deleteContactUsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if(!id) {
            return next(new ErrorHandler("Contact Us id is required", 400))
        }
        await deleteContactUs(id)
        res.status(200).json({
            success: true,
            message: "Contact Us deleted successfully"
        })
    } catch (error: any) {
        next(new ErrorHandler(`Something went wrong ${error.message}`, 500))
    }
}






