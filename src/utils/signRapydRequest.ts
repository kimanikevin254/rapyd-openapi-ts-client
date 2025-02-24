import crypto from 'crypto';

const ACCESS_KEY = process.env.RAPYD_ACCESS_KEY;
const SECRET_KEY = process.env.RAPYD_SECRET_KEY;

export function signRequest(httpMethod: string, path: string, requestJson: string = '') {
    const salt = crypto.randomBytes(12).toString('base64');
    const timestamp = Math.floor(new Date().getTime() / 1000).toString();
    let body = requestJson;

    if (JSON.stringify(requestJson) !== '{}' && requestJson !== '' && typeof requestJson !=='object' ){
        body = JSON.stringify(JSON.parse(requestJson));
    }
  
    // The signature string follows the order: method, path, salt, timestamp, access_key, secret_key, body
    const toSign = `${httpMethod.toLowerCase()}${path}${salt}${timestamp}${ACCESS_KEY}${SECRET_KEY}${body}`;
  
    // Generate HMAC signature with SHA-256 and encode in Base64 URL-safe format
    const hash = crypto.createHmac('sha256', SECRET_KEY);
    hash.update(toSign);
    const signature = Buffer.from(hash.digest("hex")).toString("base64");
    
    // Idempotency
    const idempotency = `${timestamp}${salt}`
  
    return { salt, timestamp, signature, idempotency };
}
