import { FC, PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

import { ApiProviderFirebase } from "@gemunion/provider-api-firebase";
import { UserProviderFirebase } from "@gemunion/provider-user-firebase";
import { ThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { PopupProvider } from "@gemunion/provider-popup";
import { WalletProvider } from "@gemunion/provider-wallet";
import { PickerProvider } from "@gemunion/provider-picker";
import { ReduxProvider, store } from "@gemunion/redux";
import { i18n } from "@framework/localization-market-ui";
import { EnabledLanguages, ns } from "@framework/constants";

import { Signal } from "../components/signal";
import { themeProps } from "../components/theme";
import { WalletReLogin } from "../components/wallet-relogin";

export const Providers: FC<PropsWithChildren> = props => {
  const { children } = props;
  return (
    <ReduxProvider store={store}>
      <ApiProviderFirebase baseUrl={process.env.BE_URL} storageName={ns}>
        <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
          <UserProviderFirebase>
            <ThemeProvider {...themeProps}>
              <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                <SnackbarProvider>
                  <PopupProvider>
                    <WalletProvider>
                      <PickerProvider>
                        <WalletReLogin>
                          <Signal />
                          {children}
                        </WalletReLogin>
                      </PickerProvider>
                    </WalletProvider>
                  </PopupProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </UserProviderFirebase>
        </LicenseProvider>
      </ApiProviderFirebase>
    </ReduxProvider>
  );
};
