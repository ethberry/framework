import { useMemo } from "react";
import { IconButton } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { enqueueSnackbar } from "notistack";
import { useClipboard } from "use-clipboard-copy";
import { useWeb3React } from "@web3-react/core";
import { getMarketUrl } from "../../../utils/referral";
import { useIntl } from "react-intl";
import { IMerchant } from "@framework/types";

interface IReferralButtonProps {
  endpoint?: string;
  merchant?: IMerchant;
}
export function ReferralButton(props: IReferralButtonProps) {
  const { endpoint = "/", merchant } = props;

  const clipboard = useClipboard();
  const { formatMessage } = useIntl();
  const { account = "" } = useWeb3React();

  const marketUrl = getMarketUrl();

  const referalLink = useMemo<string>(() => {
    const endpointUrl = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${marketUrl}${endpointUrl}?referrer=${account.toLocaleLowerCase()}`;
  }, [endpoint, account]);

  const handleClip = () => {
    clipboard.copy(referalLink);
    enqueueSnackbar(formatMessage({ id: "pages.referral.clipboard" }));
  };

  if (!merchant?.refLevels?.length) {
    return null;
  }

  return (
    <IconButton aria-label="referral" onClick={handleClip}>
      <IosShareIcon />
    </IconButton>
  );
}
