import { Share } from "@mui/icons-material";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";

interface IInfuraButtonProps {
  tokenId: number;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const InfuraButton = (props: IInfuraButtonProps) => {
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
      icon={Share}
      onClick={handleClick}
      message="form.buttons.ipfsInfuraSave"
      className={className}
      dataTestId="ipfsInfura"
      disabled={disabled}
      variant={variant}
    />
  );
};
