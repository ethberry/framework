import { FC, Fragment, useState } from "react";
import { Bloodtype } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";

import BreedSetPregnancyLimitsABI from "../../../../../abis/mechanics/breed/breed-limits/setPregnancyLimits.abi.json";

import type { IBreedLimitDto } from "./dialog";
import { BreedLimitDialog } from "./dialog";

export interface IBreedLimitButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const BreedLimitButton: FC<IBreedLimitButtonProps> = props => {
  const { className, disabled, variant } = props;

  const [isBreedLimitDialogOpen, setIsBreedLimitDialogOpen] = useState(false);

  const handleBreedLimit = (): void => {
    setIsBreedLimitDialogOpen(true);
  };

  const handleBreedLimitCancel = (): void => {
    setIsBreedLimitDialogOpen(false);
  };

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IBreedLimitDto, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        BreedSetPregnancyLimitsABI,
        web3Context.provider?.getSigner(),
      );
      return contract.setPregnancyLimits(values.count, values.time, values.maxTime) as Promise<void>;
    },
  );

  const metaFn = useMetamask((values: IBreedLimitDto, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.DISPENSER, values, web3Context);
  });

  const handleBreedLimitConfirmed = async (values: IBreedLimitDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBreedLimitDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleBreedLimit}
        icon={Bloodtype}
        message="pages.breed.limit"
        className={className}
        dataTestId="BreedLimitButton"
        disabled={disabled}
        variant={variant}
      />
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
