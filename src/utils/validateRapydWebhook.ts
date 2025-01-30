import { Request } from "express";
import crypto from 'crypto';

const ACCESS_KEY = process.env.RAPYD_ACCESS_KEY;
const SECRET_KEY = process.env.RAPYD_SECRET_KEY;

export function validateRapydWebhook(req: Request) {
    const receivedSignature = req.headers.signature;

    const urlPath = 'https://68af-41-81-27-255.ngrok-free.app/webhook/rapyd'
    const salt = req.headers.salt;
    const timestamp = req.headers.timestamp;
    const bodyString = JSON.stringify(req.body);

    const toSign = `${urlPath}${salt}${timestamp}${ACCESS_KEY}${SECRET_KEY}${bodyString}`;
    const hash = crypto.createHmac('sha256', SECRET_KEY);
    hash.update(toSign);
    const signature = Buffer.from(hash.digest('hex')).toString('base64');

    return receivedSignature === signature;
}