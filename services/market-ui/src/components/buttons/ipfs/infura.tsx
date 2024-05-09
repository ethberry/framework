import { IconButton, Tooltip } from "@mui/material";
import RocketIcon from "@mui/icons-material/Rocket";
import { useApiCall } from "@gemunion/react-hooks";

interface IInfuraButtonProps {
  tokenId: number;
}

export const InfuraButton = (props: IInfuraButtonProps) => {
  const { tokenId } = props;

  const { fn: fnPinToken } = useApiCall(async api => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await api.fetchJson({
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
        <RocketIcon />
      </IconButton>
    </Tooltip>
  );
};
