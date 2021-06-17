import React, {FC} from "react";
import {hot} from "react-hot-loader/root";
import {Redirect, Switch} from "react-router";
import {SnackbarProvider} from "notistack";

import {UserProvider} from "@trejgun/provider-user";
import {SettingsProvider} from "@trejgun/provider-settings";
import {LocalizationProvider} from "@trejgun/provider-localization";
import {ApiProvider} from "@trejgun/provider-api";
import {i18n} from "@trejgun/solo-localization-admin-ui";
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

import {Category} from "./category";
import {Dashboard} from "./dashboard";
import {Email} from "./email";
import {Merchant} from "./merchant";
import {Order} from "./order";
import {Photo} from "./photo";
import {Product} from "./product";
import {Profile} from "./profile";
import {Promo} from "./promo";
import {User} from "./user";

import {Layout} from "../components/common/layout";

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

                    <MyRoute path="/users" component={User} exact restricted />
                    <MyRoute path="/users/:id" component={User} restricted />

                    <MyRoute path="/products" component={Product} exact restricted />
                    <MyRoute path="/products/:id" component={Product} restricted />

                    <MyRoute path="/merchants" component={Merchant} exact restricted />
                    <MyRoute path="/merchants/:id" component={Merchant} restricted />

                    <MyRoute path="/categories" component={Category} exact restricted />
                    <MyRoute path="/categories/:id" component={Category} restricted />

                    <MyRoute path="/promos" component={Promo} restricted />
                    <MyRoute path="/promos/:id" component={Promo} restricted />

                    <MyRoute path="/orders" component={Order} exact restricted />
                    <MyRoute path="/orders/:id" component={Order} restricted />

                    <MyRoute path="/photos" component={Photo} exact restricted />

                    <MyRoute path="/emails" component={Email} restricted />

                    <MyRoute path="/error/:error" component={Error} />
                    <MyRoute path="/message/:message" component={Message} />

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
