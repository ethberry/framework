import { FC } from "react";
import { Navigate } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Error, Message, Protected } from "@ethberry/common-pages";
import { FirebaseLogin } from "@ethberry/firebase-login";
import { MetamaskLoginButton } from "@ethberry/login-button-metamask";
import { ParticleLoginButton } from "@ethberry/login-button-particle";
import { WalletConnectLoginButton } from "@ethberry/login-button-wallet-connect";

import { Layout } from "../components/common/layout";
import { Dashboard } from "./dashboard";
import { Landing } from "./landing";
import { Providers } from "./providers";
import { mechanicsRoutes } from "./mechanics/routes";
import { integrationsRoutes } from "./integrations/routes";
import { infrastructureRoutes } from "./infrastructure/routes";
import { exchangeRoutes } from "./exchange/routes";
import { ecommerceRoutes } from "./ecommerce/routes";
import { achievementsRoutes } from "./mechanics/meta/achievements/routes";
import { hierarchyRoutes } from "./hierarchy/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers>
        <Layout />
      </Providers>
    ),
    children: [
      { index: true, element: <Landing /> },
      {
        path: "/dashboard",
        element: <Protected />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        path: "/login",
        element: (
          <FirebaseLogin
            withEmail={false}
            buttons={[MetamaskLoginButton, WalletConnectLoginButton, ParticleLoginButton]}
          />
        ),
      },
      ...infrastructureRoutes,
      ...hierarchyRoutes,
      ...mechanicsRoutes,
      ...integrationsRoutes,
      ...exchangeRoutes,
      ...ecommerceRoutes,
      ...achievementsRoutes,
      {
        path: "/error/:error",
        element: <Error />,
      },
      {
        path: "/message/:message",
        element: <Message />,
      },
      { path: "*", element: <Navigate to="/message/page-not-found" /> },
    ],
  },
]);

export const App: FC = () => {
  return <RouterProvider router={router} />;
};
