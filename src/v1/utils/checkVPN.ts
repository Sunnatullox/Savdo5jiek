import ErrorHandler from '../middleware/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { getClientIp } from 'request-ip';

const checkVPN = async (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req) || "";

  try {
    // IP manzilini tekshirish uchun tashqi API dan foydalanish
    const response = await fetch(`https://ipinfo.io/${ip}/json`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const { country, org } = await response.json();

    if (!org || !country) {
      console.log(`Organization data not available for IP: ${ip}`);
      return next();
    }

    if (org.includes("VPN") || org.includes("Proxy")) {
      return res.status(403).json({ error: "VPN is not allowed" });
    }

    const countr = ["UZ", "RU", "KZ", "TJ", "KG", "TR"];

    if (!countr.includes(country.toUpperCase())) {
      return res.status(403).json({ error: "Country is not allowed" });
    }

    next();
  } catch (error) {
    console.error("Error checking IP:", error);
    next(new ErrorHandler(`Error checking IP: ${error}`, 500));
  }
};

export default checkVPN;