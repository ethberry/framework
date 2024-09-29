import { FC, Fragment, useState } from "react";
import { Link } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, TokenType } from "@framework/types";

import ERC721SimpleSetBaseURIABI from "@framework/abis/json/ERC721Simple/setBaseURI.json";

import { shouldDisableByContractType } from "../../../utils";
import { BaseTokenURIEditDialog, IBaseTokenURIDto } from "./dialog";
import { useSetButtonPermission } from "../../../../../shared";

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

  const [isBaseTokenURIDialogOpen, setIsBaseTokenURIDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const handleBaseTokenURI = (): void => {
    setIsBaseTokenURIDialogOpen(true);
  };

  const handleBaseTokenURICancel = (): void => {
    setIsBaseTokenURIDialogOpen(false);
  };

  const metaFn = useMetamask((values: IBaseTokenURIDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC721SimpleSetBaseURIABI, web3Context.provider?.getSigner());
    return contract.setBaseURI(values.baseTokenURI) as Promise<void>;
  });

  const handleBaseTokenURIConfirmed = async (values: IBaseTokenURIDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBaseTokenURIDialogOpen(false);
    });
  };

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
          !hasPermission
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
