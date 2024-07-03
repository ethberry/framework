import { Backup } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";

interface IIpfsInfuraButtonProps {
  token: IToken;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const IpfsInfuraButton = (props: IIpfsInfuraButtonProps) => {
  const { token, className, disabled, variant = ListActionVariant.button } = props;

  const { fn: fnPinToken } = useApiCall(async api => {
    return api.fetchJson({
      url: `/infura/pin/${token.id}`,
      method: "GET",
    });
  });

  const handleClick = async (): Promise<any> => {
    const pin = await fnPinToken();
    console.info("PIN: ", pin);
  };
  return (
    <ListAction
      icon={Backup}
      onClick={handleClick}
      message="form.buttons.saveToIpfs"
      className={className}
      dataTestId="saveToIpfsButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
