import { FC, PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

import { ApiProviderFirebase } from "@ethberry/provider-api-firebase";
import { UserProviderFirebase } from "@ethberry/provider-user-firebase";
import { collectionSlice } from "@ethberry/provider-collection";
import { ThemeProvider, layoutSlice } from "@ethberry/provider-theme";
import { LicenseProvider } from "@ethberry/provider-license";
import { LocalizationProvider, localizationSlice } from "@ethberry/provider-localization";
import { PopupProvider } from "@ethberry/provider-popup";
import { WalletProvider, walletSlice } from "@ethberry/provider-wallet";
import { PickerProvider } from "@ethberry/provider-picker";
import { ReduxProvider, createStore } from "@ethberry/redux";
import { i18n } from "@framework/localization-market-ui";
import { EnabledLanguages, ns } from "@framework/constants";

import { themeProps } from "../components/theme";
import { Signal } from "../components/signal";

export const Providers: FC<PropsWithChildren> = props => {
  const { children } = props;
  return (
    <ReduxProvider store={createStore([layoutSlice, localizationSlice, walletSlice, collectionSlice])}>
      <ApiProviderFirebase baseUrl={process.env.BE_URL} storageName={ns}>
        <LicenseProvider licenseKey={process.env.ETHBERRY_API_KEY}>
          <UserProviderFirebase>
            <ThemeProvider {...themeProps}>
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
          </UserProviderFirebase>
        </LicenseProvider>
      </ApiProviderFirebase>
    </ReduxProvider>
  );
};
