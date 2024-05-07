import { useMemo } from "react";
import { IconButton } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { enqueueSnackbar } from "notistack";
import { useClipboard } from "use-clipboard-copy";
import { useWeb3React } from "@web3-react/core";
import { getMarketUrl } from "../../../utils/referral";
import { useIntl } from "react-intl";

interface IReferralButtonProps {
  endpoint?: string;
}
export function ReferralButton(props: IReferralButtonProps) {
  const { endpoint = "/" } = props;
  const clipboard = useClipboard();
  const { formatMessage } = useIntl();
  // const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const { account = "" } = useWeb3React();
  const marketUrl = getMarketUrl();

  const referalLink = useMemo(() => {
    const endpointUrl = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${marketUrl}${endpointUrl}?referrer=${account.toLocaleLowerCase()}`;
  }, [endpoint, account]);

  const handleClip = () => {
    clipboard.copy(referalLink);
    enqueueSnackbar(formatMessage({ id: "pages.referral.clipboard" }));
  };

  return (
    <IconButton aria-label="referral" onClick={handleClip}>
      <IosShareIcon />
    </IconButton>
  );
}
