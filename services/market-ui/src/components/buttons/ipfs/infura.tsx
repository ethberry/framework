import { IconButton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useApiCall } from "@gemunion/react-hooks";

interface IInfuraButtonProps {
  tokenId: number;
}

export const InfuraButton = (props: IInfuraButtonProps) => {
  const { tokenId } = props;

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
    <Tooltip title="IPFS Infura">
      <IconButton aria-label="referral" onClick={() => void handleClick()}>
        <ShareIcon />
      </IconButton>
    </Tooltip>
  );
};
