import React, { FC } from "react";
import { Navigate, Routes, Route } from "react-router";
import { SnackbarProvider } from "notistack";

import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { ApiProvider } from "@gemunion/provider-api";
import { i18n } from "@gemunion/framework-localization-public-ui";
import { PickerProvider } from "@gemunion/mui-provider-picker";
import { DefaultLanguage } from "@gemunion/framework-constants-misc";
import {
  Error,
  ForgotPassword,
  Message,
  Registration,
  ResendVerificationEmail,
  RestorePassword,
  SocialLogin,
  VerifyEmail,
} from "@gemunion/common-pages";

import { Protected } from "../components/common/protected";

import { Landing } from "./landing";

import { Profile } from "./profile";

import { Layout } from "../components/common/layout";

import { ProductList } from "./product-list";
import { MerchantList } from "./merchant-list";
import { Dashboard } from "./dashboard";
import { Product } from "./product";
import { Merchant } from "./merchant";
import { Orders } from "./orders";
import { Page } from "./page";

const App: FC = () => {
  return (
    <ApiProvider baseUrl={process.env.BE_URL}>
      <UserProvider>
        <SettingsProvider defaultLanguage={DefaultLanguage}>
          <LocalizationProvider i18n={i18n} defaultLanguage={DefaultLanguage}>
            <SnackbarProvider>
              <PickerProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Landing />} />

                    <Route path="/login" element={<SocialLogin />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/restore-password/:token" element={<RestorePassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/resend-verification-email" element={<ResendVerificationEmail />} />

                    <Route
                      path="/dashboard"
                      element={
                        <Protected>
                          <Dashboard />
                        </Protected>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <Protected>
                          <Profile />
                        </Protected>
                      }
                    />
                    <Route
                      path="/profile/:tab"
                      element={
                        <Protected>
                          <Profile />
                        </Protected>
                      }
                    />

                    <Route path="/merchants" element={<MerchantList />} />
                    <Route path="/merchants/:merchantId" element={<Merchant />} />

                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:productId" element={<Product />} />

                    <Route path="/orders" element={<Orders />} />

                    <Route path="/error/:error" element={<Error />} />
                    <Route path="/message/:message" element={<Message />} />

                    <Route path="/pages/:slug" element={<Page />} />

                    <Route path="*" element={<Navigate to="/message/page-not-found" />} />
                  </Route>
                </Routes>
              </PickerProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </UserProvider>
    </ApiProvider>
  );
};

export default App;
