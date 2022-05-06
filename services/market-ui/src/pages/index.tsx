import { FC } from "react";
import { Navigate, Route, Routes } from "react-router";
import { SnackbarProvider } from "notistack";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { i18n } from "@framework/localization-market-ui";
import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { GemunionThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { WalletProvider } from "@gemunion/provider-wallet";
import { ApiProvider } from "@gemunion/provider-api";
import { EnabledLanguages } from "@framework/constants";
import { history } from "@gemunion/history";
import { Error, ForgotPassword, Message, Registration, RestorePassword } from "@gemunion/common-pages";

import { FirebaseLogin, Protected } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";
import { Landing } from "./landing";
import { Profile } from "./profile";
import { Dashboard } from "./dashboard";
import { Erc721CollectionList } from "./erc721/collection-list";
import { Erc721Collection } from "./erc721/collection";
import { Erc721TemplateList } from "./erc721/template-list";
import { Erc721Template } from "./erc721/template";
import { Erc721TokenList } from "./erc721/token-list";
import { Erc721Token } from "./erc721/token";
import { Erc1155CollectionList } from "./erc1155/collection-list";
import { Erc1155Collection } from "./erc1155/collection";
import { Erc1155TokenList } from "./erc1155/token-list";
import { Erc1155Token } from "./erc1155/token";
import { Erc1155RecipeList } from "./erc1155/recipe-list";
import { Marketplace } from "./marketplace";
import { Leaderboard } from "./leaderboard";
import { Craft } from "./craft";
import { Assets } from "./assets";
import { Auction } from "./auction";

const App: FC = () => {
  return (
    <HistoryRouter history={history}>
      <ApiProvider baseUrl={process.env.BE_URL}>
        <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
          <UserProvider>
            <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
              <GemunionThemeProvider>
                <WalletProvider>
                  <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                    <SnackbarProvider>
                      <Routes>
                        <Route element={<Layout />}>
                          <Route path="/" element={<Landing />} />

                          <Route path="/login" element={<FirebaseLogin />} />
                          <Route path="/registration" element={<Registration />} />
                          <Route path="/restore-password/:token" element={<RestorePassword />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />

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

                          <Route path="/erc721-collections" element={<Erc721CollectionList />} />
                          <Route path="/erc721-collections/:id" element={<Erc721Collection />} />

                          <Route path="/erc721-templates" element={<Erc721TemplateList />} />
                          <Route path="/erc721-templates/:id" element={<Erc721Template />} />

                          <Route path="/erc721-tokens" element={<Erc721TokenList />} />
                          <Route path="/erc721-tokens/:id" element={<Erc721Token />} />

                          <Route path="/erc1155-collections" element={<Erc1155CollectionList />} />
                          <Route path="/erc1155-collections/:id" element={<Erc1155Collection />} />

                          <Route path="/erc1155-tokens" element={<Erc1155TokenList />} />
                          <Route path="/erc1155-tokens/:id" element={<Erc1155Token />} />

                          <Route path="/erc1155-recipes" element={<Erc1155RecipeList />} />

                          <Route path="/marketplace" element={<Marketplace />} />
                          <Route path="/marketplace/:tab" element={<Marketplace />} />

                          <Route
                            path="/assets"
                            element={
                              <Protected>
                                <Assets />
                              </Protected>
                            }
                          />
                          <Route
                            path="/assets/:tab"
                            element={
                              <Protected>
                                <Assets />
                              </Protected>
                            }
                          />

                          <Route
                            path="/craft"
                            element={
                              <Protected>
                                <Craft />
                              </Protected>
                            }
                          />
                          <Route
                            path="/craft/:tab"
                            element={
                              <Protected>
                                <Craft />
                              </Protected>
                            }
                          />

                          <Route
                            path="/auction"
                            element={
                              <Protected>
                                <Auction />
                              </Protected>
                            }
                          />
                          <Route
                            path="/auction/:tab"
                            element={
                              <Protected>
                                <Auction />
                              </Protected>
                            }
                          />

                          <Route path="/leaderboard" element={<Leaderboard />} />

                          <Route path="/error/:error" element={<Error />} />
                          <Route path="/message/:message" element={<Message />} />

                          <Route path="*" element={<Navigate to="/message/page-not-found" />} />
                        </Route>
                      </Routes>
                    </SnackbarProvider>
                  </LocalizationProvider>
                </WalletProvider>
              </GemunionThemeProvider>
            </SettingsProvider>
          </UserProvider>
        </LicenseProvider>
      </ApiProvider>
    </HistoryRouter>
  );
};

export default App;
