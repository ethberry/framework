import React, { FC } from "react";
import { Route, Switch } from "react-router";

import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { i18n } from "@gemunion/framework-localization-emailer";
import { EmailType } from "@gemunion/framework-types";
import { DefaultLanguage } from "@gemunion/framework-constants-misc";

import { DataProvider } from "../components/context/data/provider";
import { Layout } from "../components/common/layout";

import { Welcome } from "./guest/welcome";
import { Verification } from "./guest/verification";
import { Forgot } from "./guest/forgot";
import { Restore } from "./guest/restore";

import { Main } from "./main";

export const App: FC<any> = ({ state }) => {
  return (
    <DataProvider data={state.data}>
      <UserProvider profile={state.user}>
        <SettingsProvider defaultLanguage={DefaultLanguage}>
          <LocalizationProvider i18n={i18n} defaultLanguage={DefaultLanguage}>
            <Layout>
              <Switch>
                <Route path="/" component={Main} exact />

                <Route path={`/${EmailType.WELCOME}`} component={Welcome} />
                <Route path={`/${EmailType.EMAIL_VERIFICATION}`} component={Verification} />
                <Route path={`/${EmailType.FORGOT_PASSWORD}`} component={Forgot} />
                <Route path={`/${EmailType.RESTORE_PASSWORD}`} component={Restore} />
              </Switch>
            </Layout>
          </LocalizationProvider>
        </SettingsProvider>
      </UserProvider>
    </DataProvider>
  );
};
