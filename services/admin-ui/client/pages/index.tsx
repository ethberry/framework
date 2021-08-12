import React, { FC } from "react";
import { hot } from "react-hot-loader/root";
import { Redirect, Switch } from "react-router";
import { SnackbarProvider } from "notistack";

import { UserProvider } from "@gemunionstudio/provider-user";
import { SettingsProvider } from "@gemunionstudio/provider-settings";
import { LocalizationProvider } from "@gemunionstudio/provider-localization";
import { ApiProvider } from "@gemunionstudio/provider-api";
import { i18n } from "@gemunionstudio/framework-localization-admin-ui";
import { PickerProvider } from "@gemunionstudio/material-ui-provider-picker";
import { DefaultLanguage } from "@gemunionstudio/framework-constants-misc";
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

import { MyRoute } from "../components/common/my-route";

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

                    <MyRoute path="/pages" component={Page} exact restricted />
                    <MyRoute path="/pages/:id" component={Page} restricted />

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
