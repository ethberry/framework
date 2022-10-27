import { FC, PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

import { FirebaseApiProvider } from "@gemunion/provider-api-firebase";
import { UserProviderFirebase } from "@gemunion/provider-user-firebase";
import { SettingsProvider } from "@gemunion/provider-settings";
import { ThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { PopupProvider } from "@gemunion/provider-popup";
import { WalletProvider } from "@gemunion/provider-wallet";
import { PickerProvider } from "@gemunion/provider-picker";
import { i18n } from "@framework/localization-market-ui";
import { EnabledLanguages, ns } from "@framework/constants";

import { themeProps } from "../components/theme";

export const Providers: FC<PropsWithChildren> = props => {
  const { children } = props;
  return (
    <FirebaseApiProvider baseUrl={process.env.BE_URL} storageName={ns}>
      <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
        <UserProviderFirebase>
          <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
            <ThemeProvider {...themeProps}>
              <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                <SnackbarProvider>
                  <PopupProvider>
                    <WalletProvider>
                      <PickerProvider>{children}</PickerProvider>
                    </WalletProvider>
                  </PopupProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SettingsProvider>
        </UserProviderFirebase>
      </LicenseProvider>
    </FirebaseApiProvider>
  );
};
