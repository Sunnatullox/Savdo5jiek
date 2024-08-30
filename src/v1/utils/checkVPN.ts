import axios from 'axios';
import ErrorHandler from '../middleware/ErrorHandler';
import { NextFunction, Request, Response } from 'express';

const checkVPN = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip; // Foydalanuvchining IP manzilini olish

  try {
    // IP manzilini tekshirish uchun tashqi API dan foydalanish
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const { country, org } = response.data;
    if (org.includes("VPN") || org.includes("Proxy")) {
      return res.status(403).json({ error: "VPN is not allowed" });
    }

    const countr = ["UZ", "RU", "KZ", "TJ", "KG", "AF"];

    if (countr.includes(country.toUpperCase())) {
      return res.status(403).json({ error: "VPN is not allowed" });
    }

    next();
  } catch (error) {
    console.error("Error checking IP:", error);
    next(new ErrorHandler(`Error checking IP: ${error}`, 500));
  }
};

export default checkVPN;