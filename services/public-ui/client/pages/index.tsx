import React, {FC} from "react";
import {hot} from "react-hot-loader/root";
import {Redirect, Switch} from "react-router";
import {SnackbarProvider} from "notistack";

import {UserProvider} from "@gemunionstudio/provider-user";
import {SettingsProvider} from "@gemunionstudio/provider-settings";
import {LocalizationProvider} from "@gemunionstudio/provider-localization";
import {ApiProvider} from "@gemunionstudio/provider-api";
import {i18n} from "@gemunionstudio/solo-localization-public-ui";
import {PickerProvider} from "@gemunionstudio/material-ui-provider-picker";
import {DefaultLanguage} from "@gemunionstudio/solo-constants-misc";
import {
  Error,
  ForgotPassword,
  Message,
  Registration,
  ResendVerificationEmail,
  RestorePassword,
  SocialLogin,
  VerifyEmail,
} from "@gemunionstudio/common-pages";

import {MyRoute} from "../components/common/my-route";

import {Landing} from "./landing";

import {Profile} from "./profile";

import {Layout} from "../components/common/layout";

import {ProductList} from "./product-list";
import {MerchantList} from "./merchant-list";
import {Dashboard} from "./dashboard";
import {Product} from "./product";
import {Merchant} from "./merchant";
import {Orders} from "./orders";
import {Page} from "./page";

const App: FC = () => {
  return (
    <ApiProvider baseUrl={process.env.BE_URL}>
      <UserProvider>
        <SettingsProvider defaultLanguage={DefaultLanguage}>
          <LocalizationProvider i18n={i18n} defaultLanguage={DefaultLanguage}>
            <SnackbarProvider>
              <PickerProvider>
                <Layout>
                  <Switch>
                    <MyRoute path="/" component={Landing} exact />

                    <MyRoute path="/login" component={SocialLogin} exact />
                    <MyRoute path="/registration" component={Registration} exact />
                    <MyRoute path="/restore-password/:token" component={RestorePassword} exact />
                    <MyRoute path="/verify-email/:token" component={VerifyEmail} exact />
                    <MyRoute path="/forgot-password" component={ForgotPassword} exact />
                    <MyRoute path="/resend-verification-email" component={ResendVerificationEmail} exact />

                    <MyRoute path="/dashboard" component={Dashboard} exact restricted />

                    <MyRoute path="/profile" component={Profile} exact restricted />
                    <MyRoute path="/profile/:tab" component={Profile} restricted />

                    <MyRoute path="/merchants" component={MerchantList} exact />
                    <MyRoute path="/merchants/:merchantId" component={Merchant} exact />

                    <MyRoute path="/products" component={ProductList} exact />
                    <MyRoute path="/products/:productId" component={Product} exact />

                    <MyRoute path="/orders" component={Orders} exact />

                    <MyRoute path="/error/:error" component={Error} />
                    <MyRoute path="/message/:message" component={Message} />

                    <MyRoute path="/pages/:slug" component={Page} />

                    <Redirect to="/message/page-not-found" />
                  </Switch>
                </Layout>
              </PickerProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </UserProvider>
    </ApiProvider>
  );
};

export default hot(App);
