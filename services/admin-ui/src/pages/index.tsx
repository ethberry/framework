import { FC } from "react";
import { Navigate, Route, Routes } from "react-router";
import { SnackbarProvider } from "notistack";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { i18n } from "@framework/localization-admin-ui";
import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { GemunionThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { WalletProvider } from "@gemunion/provider-wallet";
import { ApiProvider } from "@gemunion/provider-api";
import { EnabledLanguages } from "@framework/constants";
import { history } from "@gemunion/history";
import {
  Error,
  ForgotPassword,
  Message,
  Registration,
  ResendVerificationEmail,
  RestorePassword,
  VerifyEmail,
} from "@gemunion/common-pages";
import { FirebaseLogin, Protected } from "@gemunion/firebase-login";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";
import { User } from "./user";
import { Erc20Token } from "./erc20/token";
import { Erc721Collection } from "./erc721/collection";
import { Erc721Template } from "./erc721/template";
import { Erc721Token } from "./erc721/token";
import { Erc721Airdrop } from "./erc721/airdrop";
import { Erc721Dropbox } from "./erc721/dropbox";
import { Erc1155Collection } from "./erc1155/collection";
import { Erc1155Token } from "./erc1155/token";
import { Erc1155Recipes } from "./erc1155/recipe";
import { Blockchain } from "./blockchain";

import { Layout } from "../components/common/layout";

const App: FC = () => {
  return (
    <HistoryRouter history={history}>
      <ApiProvider baseUrl={process.env.BE_URL}>
        <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
          <UserProvider>
            <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
              <GemunionThemeProvider>
                <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                  <WalletProvider>
                    <SnackbarProvider>
                      <Routes>
                        <Route element={<Layout />}>
                          <Route path="/" element={<Landing />} />

                          <Route path="/login" element={<FirebaseLogin />} />
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
                            path="/blockchain"
                            element={
                              <Protected>
                                <Blockchain />
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
                            path="/erc721-collections"
                            element={
                              <Protected>
                                <Erc721Collection />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-collections/:id"
                            element={
                              <Protected>
                                <Erc721Collection />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc20-tokens"
                            element={
                              <Protected>
                                <Erc20Token />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc20-tokens/:id"
                            element={
                              <Protected>
                                <Erc20Token />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc721-templates"
                            element={
                              <Protected>
                                <Erc721Template />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-templates/:id"
                            element={
                              <Protected>
                                <Erc721Template />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc721-dropboxes"
                            element={
                              <Protected>
                                <Erc721Dropbox />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-dropboxes/:id"
                            element={
                              <Protected>
                                <Erc721Dropbox />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc721-airdrops"
                            element={
                              <Protected>
                                <Erc721Airdrop />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-airdrops/:id"
                            element={
                              <Protected>
                                <Erc721Airdrop />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc721-tokens"
                            element={
                              <Protected>
                                <Erc721Token />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-tokens/:id"
                            element={
                              <Protected>
                                <Erc721Token />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc721-tokens"
                            element={
                              <Protected>
                                <Erc721Token />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc721-tokens/:id"
                            element={
                              <Protected>
                                <Erc721Token />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc1155-collections"
                            element={
                              <Protected>
                                <Erc1155Collection />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc1155-collections/:id"
                            element={
                              <Protected>
                                <Erc1155Collection />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc1155-tokens"
                            element={
                              <Protected>
                                <Erc1155Token />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc1155-tokens/:id"
                            element={
                              <Protected>
                                <Erc1155Token />
                              </Protected>
                            }
                          />

                          <Route
                            path="/erc1155-recipes"
                            element={
                              <Protected>
                                <Erc1155Recipes />
                              </Protected>
                            }
                          />
                          <Route
                            path="/erc1155-recipes/:id"
                            element={
                              <Protected>
                                <Erc1155Recipes />
                              </Protected>
                            }
                          />

                          <Route path="/error/:error" element={<Error />} />
                          <Route path="/message/:message" element={<Message />} />

                          <Route path="*" element={<Navigate to="/message/page-not-found" />} />
                        </Route>
                      </Routes>
                    </SnackbarProvider>
                  </WalletProvider>
                </LocalizationProvider>
              </GemunionThemeProvider>
            </SettingsProvider>
          </UserProvider>
        </LicenseProvider>
      </ApiProvider>
    </HistoryRouter>
  );
};

export default App;
