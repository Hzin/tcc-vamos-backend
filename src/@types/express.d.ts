declare namespace Express {
  export interface Request {
    admin_token: string;
    user: {
      id_user: string;
    };
  }
}
