import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { PauseCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";
import { useMetamask, useMetamaskValue } from "@gemunion/react-hooks-eth";

import PauseSol from "../../../../menu/contract/pausable/pause.abi.json";

export const PauseToggleButton: FC = () => {
  const [pauseStatus, setPauseStatus] = useState<boolean>(false);

  const getPauseStatus = useMetamaskValue(
    async (web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.STAKING_ADDR, PauseSol.abi, web3Context.provider?.getSigner());
      return ((await contract.paused()) as boolean) || false;
    },
    { success: false },
  );

  useEffect(() => {
    if (pauseStatus) {
      return;
    }

    void getPauseStatus().then((value: boolean) => {
      setPauseStatus(value);
    });
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, PauseSol.abi, web3Context.provider?.getSigner());
    if (pauseStatus) {
      return contract.unpause() as Promise<void>;
    } else {
      return contract.pause() as Promise<void>;
    }
  });

  const handleToggle = () => {
    return metaFn().finally(() => {
      setPauseStatus(!pauseStatus);
    });
  };

  return (
    <Button startIcon={<PauseCircleOutline />} onClick={handleToggle} data-testid="ContractPauseToggleButton">
      <FormattedMessage id={pauseStatus ? "form.buttons.unpause" : "form.buttons.pause"} />
    </Button>
  );
};
