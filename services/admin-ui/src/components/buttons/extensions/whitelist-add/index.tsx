import { FC, Fragment, useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";
import { whitelistERC20WhitelistABI } from "@framework/abis";

export interface IWhitelistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WhitelistButton: FC<IWhitelistButtonProps> = props => {
  const {
    className,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isWhitelistDialogOpen, setIsWhitelistDialogOpen] = useState(false);

  const handleWhitelist = (): void => {
    setIsWhitelistDialogOpen(true);
  };

  const handleWhitelistCancel = (): void => {
    setIsWhitelistDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, whitelistERC20WhitelistABI, web3Context.provider?.getSigner());
    return contract.whitelist(values.account) as Promise<void>;
  });

  const handleWhitelistConfirmed = async (values: IAccountDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsWhitelistDialogOpen(false);
    });
  };

  if (!contractFeatures.includes(ContractFeatures.WHITELIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleWhitelist}
        icon={CheckCircle}
        message="form.buttons.whitelist"
        className={className}
        dataTestId="WhitelistButton"
        disabled={disabled}
        variant={variant}
      />
      <AccountDialog
        onCancel={handleWhitelistCancel}
        onConfirm={handleWhitelistConfirmed}
        open={isWhitelistDialogOpen}
        message="dialogs.whitelist"
        testId="AccessListWhitelistForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
