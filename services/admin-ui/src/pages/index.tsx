import { FC } from "react";
import { Navigate, Route, Routes } from "react-router";
import { SnackbarProvider } from "notistack";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { i18n } from "@gemunion/framework-localization-admin-ui";
import { GemunionThemeProvider } from "@gemunion/provider-theme";
import { history } from "@gemunion/history";
import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { ApiProvider } from "@gemunion/provider-api";
import { PickerProvider } from "@gemunion/provider-picker";
import { EnabledLanguages } from "@gemunion/framework-constants";
import {
  Error,
  ForgotPassword,
  Message,
  Protected,
  Registration,
  ResendVerificationEmail,
  RestorePassword,
  SocialLogin,
  VerifyEmail,
} from "@gemunion/common-pages";

import { Landing } from "./landing";

import { Category } from "./category";
import { Dashboard } from "./dashboard";
import { Email } from "./email";
import { Merchant } from "./merchant";
import { Order } from "./order";
import { Page } from "./page";
import { Photo } from "./photo";
import { Product } from "./product";
import { Profile } from "./profile";
import { Promo } from "./promo";
import { User } from "./user";

import { Layout } from "../components/common/layout";

export const App: FC = () => {
  return (
    <HistoryRouter history={history}>
      <ApiProvider baseUrl={process.env.BE_URL}>
        <UserProvider>
          <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
            <GemunionThemeProvider>
              <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
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

                        <Route
                          path="/users"
                          element={
                            <Protected>
                              <User />
                            </Protected>
                          }
                        />
                        <Route
                          path="/users/:id"
                          element={
                            <Protected>
                              <User />
                            </Protected>
                          }
                        />

                        <Route
                          path="/products"
                          element={
                            <Protected>
                              <Product />
                            </Protected>
                          }
                        />
                        <Route
                          path="/products/:id"
                          element={
                            <Protected>
                              <Product />
                            </Protected>
                          }
                        />

                        <Route
                          path="/merchants"
                          element={
                            <Protected>
                              <Merchant />
                            </Protected>
                          }
                        />
                        <Route
                          path="/merchants/:id"
                          element={
                            <Protected>
                              <Merchant />
                            </Protected>
                          }
                        />

                        <Route
                          path="/categories"
                          element={
                            <Protected>
                              <Category />
                            </Protected>
                          }
                        />
                        <Route
                          path="/categories/:id"
                          element={
                            <Protected>
                              <Category />
                            </Protected>
                          }
                        />

                        <Route
                          path="/promos"
                          element={
                            <Protected>
                              <Promo />
                            </Protected>
                          }
                        />
                        <Route
                          path="/promos/:id"
                          element={
                            <Protected>
                              <Promo />
                            </Protected>
                          }
                        />

                        <Route
                          path="/orders"
                          element={
                            <Protected>
                              <Order />
                            </Protected>
                          }
                        />
                        <Route
                          path="/orders/:id"
                          element={
                            <Protected>
                              <Order />
                            </Protected>
                          }
                        />

                        <Route
                          path="/pages"
                          element={
                            <Protected>
                              <Page />
                            </Protected>
                          }
                        />
                        <Route
                          path="/pages/:id"
                          element={
                            <Protected>
                              <Page />
                            </Protected>
                          }
                        />

                        <Route
                          path="/photos"
                          element={
                            <Protected>
                              <Photo />
                            </Protected>
                          }
                        />

                        <Route
                          path="/emails"
                          element={
                            <Protected>
                              <Email />
                            </Protected>
                          }
                        />

                        <Route path="/error/:error" element={<Error />} />
                        <Route path="/message/:message" element={<Message />} />

                        <Route path="*" element={<Navigate to="/message/page-not-found" />} />
                      </Route>
                    </Routes>
                  </PickerProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </GemunionThemeProvider>
          </SettingsProvider>
        </UserProvider>
      </ApiProvider>
    </HistoryRouter>
  );
};

export default App;
