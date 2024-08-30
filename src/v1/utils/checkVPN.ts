import axios from 'axios';
import ErrorHandler from '../middleware/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { getClientIp } from 'request-ip';

const checkVPN = async (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req) || "";

  try {
    // IP manzilini tekshirish uchun tashqi API dan foydalanish
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const { country, org } = response.data;

    if (org && !(org.includes("VPN") && org.includes("Proxy"))) {
      return res.status(403).json({ error: "VPN is not allowed", org });
    }

    const countr = ["UZ", "RU", "KZ", "TJ", "KG"];

    if (country && !countr.includes(country.toUpperCase())) {
      return res.status(403).json({ error: "Country is not allowed", country });
    }

    next();
  } catch (error) {
    console.error("Error checking IP:", error);
    next(new ErrorHandler(`Error checking IP: ${error}`, 500));
  }
};

export default checkVPN;