import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import type { IMysteryContractDeployDto } from "@framework/types";
import { MysteryContractTemplates } from "@framework/types";

import MysteryboxDeployMysteryboxABI from "../../../../../abis/mechanics/mysterybox/deploy/deployMysterybox.abi.json";

import { MysteryContractDeployDialog } from "./dialog";

export interface IMysteryContractDeployButtonProps {
  className?: string;
}

export const MysteryContractDeployButton: FC<IMysteryContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IMysteryContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        MysteryboxDeployMysteryboxABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployMysterybox(
        {
          nonce,
          bytecode: sign.bytecode,
        },
        // values,
        {
          contractTemplate: Object.values(MysteryContractTemplates).indexOf(values.contractTemplate).toString(),
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
        url: "/contract-manager/mysterybox",
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
        data-testid="MysteryContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <MysteryContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: MysteryContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
