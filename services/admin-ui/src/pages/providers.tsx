import { FC, PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

import { ApiProviderFirebase } from "@gemunion/provider-api-firebase";
import { UserProviderFirebase } from "@gemunion/provider-user-firebase";
import { ThemeProvider, layoutSlice } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider, localizationSlice } from "@gemunion/provider-localization";
import { collectionSlice } from "@gemunion/provider-collection";
import { PopupProvider } from "@gemunion/provider-popup";
import { WalletProvider, walletSlice } from "@gemunion/provider-wallet";
import { PickerProvider } from "@gemunion/provider-picker";
import { ReduxProvider, createStore } from "@gemunion/redux";
import { i18n } from "@framework/localization-admin-ui";
import { EnabledLanguages, ns } from "@framework/constants";

import { themeProps } from "../components/theme";
import { Signal } from "../components/signal";

export const Providers: FC<PropsWithChildren> = props => {
  const { children } = props;
  return (
    <ReduxProvider store={createStore([collectionSlice, localizationSlice, layoutSlice, walletSlice])}>
      <ApiProviderFirebase baseUrl={process.env.BE_URL} storageName={ns}>
        <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
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
