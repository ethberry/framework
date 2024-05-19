import { useMemo } from "react";
import { enqueueSnackbar } from "notistack";
import { useClipboard } from "use-clipboard-copy";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";
import { Share } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";

interface IReferralButtonProps {
  className?: string;
  disabled?: boolean;
  endpoint?: string;
  variant?: ListActionVariant;
}
export function ReferralButton(props: IReferralButtonProps) {
  const { endpoint = "/", className, disabled, variant } = props;

  const clipboard = useClipboard();
  const { formatMessage } = useIntl();
  const { account = "" } = useWeb3React();

  const marketUrl = process.env.MARKET_FE_URL;

  const referalLink = useMemo<string>(() => {
    const endpointUrl = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${marketUrl}${endpointUrl}?referrer=${account.toLocaleLowerCase()}`;
  }, [endpoint, account]);

  const handleClick = () => {
    clipboard.copy(referalLink);
    enqueueSnackbar(formatMessage({ id: "snackbar.clipboard" }));
  };

  return (
    <ListAction
      icon={Share}
      onClick={handleClick}
      message="form.buttons.share"
      className={className}
      dataTestId="TokenShareButton"
      disabled={disabled}
      variant={variant || ListActionVariant.button}
    />
  );
}
