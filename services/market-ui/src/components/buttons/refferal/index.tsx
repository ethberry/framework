import { IconButton } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { enqueueSnackbar } from "notistack";
import { useWeb3React } from "@web3-react/core";
import { useClipboard } from "use-clipboard-copy";
import { getMarketUrl } from "../../../utils/referral";
import { useMemo } from "react";
import { objectToQueryString } from "../../../utils/queryParam";
// import { FC } from "react";

interface IReferralButtonProps {
  endpoint?: string;
  queryParams?: Record<string, any>;
  popupText?: string;
}
export function ReferralButton({
  popupText = "Copied referral link",
  endpoint = "/",
  queryParams = {},
}: IReferralButtonProps) {
  const clipboard = useClipboard();
  // const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const { account = "", isActive } = useWeb3React();
  const marketUrl = getMarketUrl();

  const endpointUrl = useMemo(() => {
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  }, [endpoint]);

  const queryParamUrl = useMemo(() => {
    if (isActive && account) {
      return objectToQueryString({ ...queryParams, referrer: account.toLocaleLowerCase() });
    }
    return objectToQueryString(queryParams);
  }, [isActive, account, queryParams]);

  const handleClip = () => {
    clipboard.copy(`${marketUrl}${endpointUrl}${queryParamUrl}`);

    // ? Where in localization to put this text?
    enqueueSnackbar(popupText, {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
    });
  };
  return (
    <IconButton aria-label="referral" onClick={handleClip}>
      <IosShareIcon />
    </IconButton>
  );
}
