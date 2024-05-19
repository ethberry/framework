import { Backup } from "@mui/icons-material";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";

interface IIpfsInfuraButtonProps {
  tokenId: number;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const IpfsInfuraButton = (props: IIpfsInfuraButtonProps) => {
  const { tokenId, className, disabled, variant = ListActionVariant.button } = props;

  const { fn: fnPinToken } = useApiCall(async api => {
    return api.fetchJson({
      url: `/infura/pin/${tokenId}`,
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
