import type { RouteObject } from "react-router-dom";

import { Registration } from "./registration";
import { SystemLogin } from "./system-login";
import { ForgotPassword } from "./forgot-password";
import { RestorePassword } from "./restore-password";
import { VerifyEmail } from "./verify-email";
import { ResendVerificationEmail } from "./resend-verification-email";

export const routes: Array<RouteObject> = [
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <SystemLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/restore-password/:token",
    element: <RestorePassword />,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
  },
  {
    path: "/resend-verification-email",
    element: <ResendVerificationEmail />,
  },
];
