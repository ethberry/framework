import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { Bloodtype } from "@mui/icons-material";

import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import BreedSetPregnancyLimitsABI from "../../../../../abis/mechanics/breed/breed-limits/setPregnancyLimits.abi.json";

import { BreedLimitDialog, IBreedLimitDto } from "./edit";

export const BreedLimitButton: FC = () => {
  const [isBreedLimitDialogOpen, setIsBreedLimitDialogOpen] = useState(false);

  const handleBreedLimit = (): void => {
    setIsBreedLimitDialogOpen(true);
  };

  const handleBreedLimitCancel = (): void => {
    setIsBreedLimitDialogOpen(false);
  };

  const metaFn = useMetamask((values: IBreedLimitDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      process.env.EXCHANGE_ADDR,
      BreedSetPregnancyLimitsABI,
      web3Context.provider?.getSigner(),
    );
    return contract.setPregnancyLimits(values.count, values.time, values.maxTime) as Promise<void>;
  });

  const handleBreedLimitConfirmed = async (values: IBreedLimitDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBreedLimitDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <Button startIcon={<Bloodtype />} onClick={handleBreedLimit} data-testid="BreedLimitButton">
        <FormattedMessage id="pages.breed.limit" />
      </Button>
      <BreedLimitDialog
        onCancel={handleBreedLimitCancel}
        onConfirm={handleBreedLimitConfirmed}
        open={isBreedLimitDialogOpen}
        initialValues={{
          count: 0,
          time: 0,
          maxTime: 0,
        }}
      />
    </Fragment>
  );
};
