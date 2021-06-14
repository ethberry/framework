interface ISessionCookieData {
  /** Returns the original `maxAge` (time-to-live), in milliseconds, of the session cookie. */
  originalMaxAge: number;
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean | "auto";
  sameSite?: boolean | "lax" | "strict" | "none";
}

export interface ISession {
  cookie: ISessionCookieData;
  passport: {
    user: number;
  };
}
