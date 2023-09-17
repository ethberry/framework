import { FC, Fragment, useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import WhitelistABI from "../../../../abis/extensions/whitelist-add/whitelist.abi.json";

import { ListAction, ListActionVariant } from "../../../common/lists";
import { AccountDialog, IAccountDto } from "../../../dialogs/account";

export interface IWhitelistMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WhitelistMenuItem: FC<IWhitelistMenuItemProps> = props => {
  const {
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
    const contract = new Contract(address, WhitelistABI, web3Context.provider?.getSigner());
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
