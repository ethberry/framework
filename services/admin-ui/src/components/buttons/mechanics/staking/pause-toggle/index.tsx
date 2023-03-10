import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { PauseCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";

import { useMetamask, useMetamaskValue } from "@gemunion/react-hooks-eth";

import PauseABI from "./pause.abi.json";
// import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

export interface IPauseToggleButton {
  className?: string;
}

export const PauseToggleButton: FC<IPauseToggleButton> = props => {
  const { className } = props;

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const getPauseStatus = useMetamaskValue(
    async (web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.STAKING_ADDR, PauseABI, web3Context.provider?.getSigner());
      return ((await contract.paused()) as boolean) || false;
    },
    { success: false },
  );

  useEffect(() => {
    if (isPaused) {
      return;
    }

    void getPauseStatus().then((value: boolean) => {
      setIsPaused(value);
    });
  }, [isPaused]);

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.STAKING_ADDR, PauseABI, web3Context.provider?.getSigner());
    if (isPaused) {
      return contract.unpause() as Promise<void>;
    } else {
      return contract.pause() as Promise<void>;
    }
  });

  const handleToggle = () => {
    return metaFn().finally(() => {
      setIsPaused(!isPaused);
    });
  };

  return (
    <Button
      startIcon={<PauseCircleOutline />}
      onClick={handleToggle}
      data-testid="ContractPauseToggleButton"
      className={className}
    >
      <FormattedMessage id={isPaused ? "form.buttons.unpause" : "form.buttons.pause"} />
    </Button>
  );
};
