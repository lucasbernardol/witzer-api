declare namespace Express {
  export interface Request {
    code: {
      plain?: string;
      hash?: string;
    };
  }
}
