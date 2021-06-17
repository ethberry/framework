import React, {FC} from "react";
import {hot} from "react-hot-loader/root";
import {Redirect, Switch} from "react-router";
import {SnackbarProvider} from "notistack";

import {UserProvider} from "@trejgun/provider-user";
import {SettingsProvider} from "@trejgun/provider-settings";
import {LocalizationProvider} from "@trejgun/provider-localization";
import {ApiProvider} from "@trejgun/provider-api";
import {i18n} from "@trejgun/solo-localization-public-ui";
import {PickerProvider} from "@trejgun/material-ui-provider-picker";
import {DefaultLanguage} from "@trejgun/solo-constants-misc";
import {
  Error,
  ForgotPassword,
  Message,
  Registration,
  ResendVerificationEmail,
  RestorePassword,
  SocialLogin,
  VerifyEmail,
} from "@trejgun/common-pages";

import {MyRoute} from "../components/common/my-route";

import {Landing} from "./landing";

import {Profile} from "./profile";

import {Layout} from "../components/common/layout";

import {ProductList} from "./product-list";
import {MerchantList} from "./merchant-list";
import {Dashboard} from "./dashboard";
import {Product} from "./product";
import {Merchant} from "./merchant";
import {AboutUs} from "./static/about-us";
import {Orders} from "./orders";

const App: FC = () => {
  return (
    <ApiProvider>
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

                    <MyRoute path="/about-us" component={AboutUs} />

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
