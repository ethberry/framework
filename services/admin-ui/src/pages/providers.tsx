import { FC, PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

import { ApiProviderFirebase } from "@gemunion/provider-api-firebase";
import { UserProviderFirebase } from "@gemunion/provider-user-firebase";
import { SettingsProvider } from "@gemunion/provider-settings";
import { ThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { PopupProvider } from "@gemunion/provider-popup";
import { WalletProvider } from "@gemunion/provider-wallet";
import { PickerProvider } from "@gemunion/provider-picker";
import { i18n } from "@framework/localization-admin-ui";
import { EnabledLanguages, ns } from "@framework/constants";

import { Signal } from "../components/signal";

export const Providers: FC<PropsWithChildren> = props => {
  const { children } = props;
  return (
    <ApiProviderFirebase baseUrl={process.env.BE_URL} storageName={ns}>
      <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
        <UserProviderFirebase>
          <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
            <ThemeProvider>
              <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                <SnackbarProvider>
                  <PopupProvider>
                    <WalletProvider>
                      <PickerProvider>
                        <Signal />
                        {children}
                      </PickerProvider>
                    </WalletProvider>
                  </PopupProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SettingsProvider>
        </UserProviderFirebase>
      </LicenseProvider>
    </ApiProviderFirebase>
  );
};
