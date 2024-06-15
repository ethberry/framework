import { FC } from "react";
import { Navigate } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initDB } from "react-indexed-db-hook";

import { Error, Landing, Message, Protected } from "@gemunion/common-pages";
import { FirebaseLogin } from "@gemunion/firebase-login";
import { MetamaskLoginButton } from "@gemunion/login-button-metamask";
import { ParticleLoginButton } from "@gemunion/login-button-particle";
import { WalletConnectLoginButton } from "@gemunion/login-button-wallet-connect";

import { Layout } from "../components/common/layout";
import { Dashboard } from "./dashboard";
import { Providers } from "./providers";
import { hierarchyRoutes } from "./hierarchy/routes";
import { mechanicsRoutes } from "./mechanics/routes";
import { integrationsRoutes } from "./integrations/routes";
import { infrastructureRoutes } from "./infrastructure/routes";
import { exchangeRoutes } from "./exchange/routes";
import { ecommerceRoutes } from "./ecommerce/routes";
import { myDBConfig } from "../components/dbstorage/db.config";

initDB(myDBConfig);

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
