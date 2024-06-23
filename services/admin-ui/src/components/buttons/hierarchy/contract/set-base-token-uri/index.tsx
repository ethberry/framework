import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, TokenType } from "@framework/types";

import setBaseURIABI from "@framework/abis/setBaseURI/SetBaseURI.json";

import { useCheckPermissions } from "../../../../../utils/use-check-access";
import { shouldDisableByContractType } from "../../../utils";
import { BaseTokenURIEditDialog, IBaseTokenURIDto } from "./dialog";

export interface ISetBaseTokenURIButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const SetBaseTokenURIButton: FC<ISetBaseTokenURIButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures, baseTokenURI, contractType },
    disabled,
    variant,
  } = props;

  const { account } = useWeb3React();

  const [isBaseTokenURIDialogOpen, setIsBaseTokenURIDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);
  const { fn: checkPermissions } = useCheckPermissions();

  const handleBaseTokenURI = (): void => {
    setIsBaseTokenURIDialogOpen(true);
  };

  const handleBaseTokenURICancel = (): void => {
    setIsBaseTokenURIDialogOpen(false);
  };

  const metaFn = useMetamask((values: IBaseTokenURIDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, setBaseURIABI, web3Context.provider?.getSigner());
    return contract.setBaseURI(values.baseTokenURI) as Promise<void>;
  });

  const handleBaseTokenURIConfirmed = async (values: IBaseTokenURIDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBaseTokenURIDialogOpen(false);
    });
  };

  useEffect(() => {
    if (account) {
      void checkPermissions(void 0, {
        account,
        address,
        role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

  if (contractType === TokenType.NATIVE || contractType === TokenType.ERC20) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleBaseTokenURI}
        icon={Link}
        message="form.buttons.baseTokenURI"
        className={className}
        dataTestId="SetTokenURIButton"
        disabled={
          disabled ||
          shouldDisableByContractType(contract) ||
          contractFeatures.includes(ContractFeatures.SOULBOUND) ||
          !hasAccess
        }
        variant={variant}
      />
      <BaseTokenURIEditDialog
        onCancel={handleBaseTokenURICancel}
        onConfirm={handleBaseTokenURIConfirmed}
        open={isBaseTokenURIDialogOpen}
        initialValues={{ baseTokenURI }}
      />
    </Fragment>
  );
};
