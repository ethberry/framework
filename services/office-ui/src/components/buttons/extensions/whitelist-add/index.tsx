import { FC, Fragment, useEffect, useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import WhitelistABI from "@framework/abis/whitelist/ERC20Whitelist.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";
import { shouldDisableByContractType } from "../../../utils";
import { useCheckPermissions } from "../../../../utils/use-check-permissions";

export interface IWhitelistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WhitelistButton: FC<IWhitelistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isWhitelistDialogOpen, setIsWhitelistDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

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

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

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
        disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
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
