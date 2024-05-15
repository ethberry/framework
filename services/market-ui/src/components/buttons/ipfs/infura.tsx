import { IconButton, Tooltip } from "@mui/material";
import { Share } from "@mui/icons-material";
import { useApiCall } from "@gemunion/react-hooks";

interface IIpfsInfuraButtonProps {
  tokenId: number;
}

export const IpfsInfuraButton = (props: IIpfsInfuraButtonProps) => {
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
        <Share />
      </IconButton>
    </Tooltip>
  );
};
