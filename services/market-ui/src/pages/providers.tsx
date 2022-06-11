import { FC } from "react";
import { SnackbarProvider } from "notistack";

import { UserProvider } from "@gemunion/provider-user";
import { SettingsProvider } from "@gemunion/provider-settings";
import { ThemeProvider } from "@gemunion/provider-theme";
import { LicenseProvider } from "@gemunion/provider-license";
import { LocalizationProvider } from "@gemunion/provider-localization";
import { PopupProvider } from "@gemunion/provider-popup";
import { WalletProvider } from "@gemunion/provider-wallet";
import { ApiProvider } from "@gemunion/provider-api";
import { PickerProvider } from "@gemunion/provider-picker";
import { i18n } from "@framework/localization-market-ui";
import { EnabledLanguages } from "@framework/constants";
import { SeaportProvider } from "../components/providers/seaport";

export const Providers: FC = props => {
  const { children } = props;
  return (
    <ApiProvider baseUrl={process.env.BE_URL}>
      <LicenseProvider licenseKey={process.env.GEMUNION_API_KEY}>
        <UserProvider>
          <SettingsProvider defaultLanguage={EnabledLanguages.EN}>
            <ThemeProvider>
              <LocalizationProvider i18n={i18n} defaultLanguage={EnabledLanguages.EN}>
                <SnackbarProvider>
                  <PopupProvider>
                    <WalletProvider>
                      <SeaportProvider contractAddress={process.env.SEAPORT_ADDR}>
                        <PickerProvider>{children}</PickerProvider>
                      </SeaportProvider>
                    </WalletProvider>
                  </PopupProvider>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SettingsProvider>
        </UserProvider>
      </LicenseProvider>
    </ApiProvider>
  );
};
