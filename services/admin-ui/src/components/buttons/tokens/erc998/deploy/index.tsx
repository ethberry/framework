import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IErc998ContractDeployDto, IUser } from "@framework/types";
import { Erc998ContractTemplates } from "@framework/types";

import DeployERC998TokenABI from "../../../../../abis/hierarchy/erc998/contract-deploy/deployERC998Token.abi.json";

import { Erc998ContractDeployDialog } from "./dialog";

export interface IErc998ContractDeployButtonProps {
  className?: string;
}

export const Erc998ContractDeployButton: FC<IErc998ContractDeployButtonProps> = props => {
  const { className } = props;

  const user = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc998ContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployERC998TokenABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC998Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: user.profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(Erc998ContractTemplates).indexOf(values.contractTemplate).toString(),
          name: values.name,
          symbol: values.symbol,
          baseTokenURI: values.baseTokenURI,
          royalty: values.royalty,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc998",
        method: "POST",
        data: values,
      },
      form,
    );
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="Erc998ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc998ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc998ContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
