import process from 'node:process';
import qrcode from 'qrcode';

const HOST = process.env.HOST;

type QRCodeHashFunction = (hash: string) => Promise<Buffer>;

const makeURL = (hash: string): string => {
  const url = new URL(HOST);

  url.pathname = `/${hash}`;

  return url.href;
};

export const qrcodeHash: QRCodeHashFunction = async (hash) => {
  return await qrcode.toBuffer(makeURL(hash), {
    width: 400,
    margin: 4,
    errorCorrectionLevel: 'M',
    type: 'png',
  });
};
