import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IPaymentSplitterContractDeployDto, IUser } from "@framework/types";

import { PaymentSplitterContractDeployDialog } from "./dialog";
import PaymentSplitterFactoryFacetDeployPaymentSplitterABI from "@framework/abis/json/PaymentSplitterFactoryFacet/deployPaymentSplitter.json";

export interface IPaymentSplitterContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PaymentSplitterContractDeployButton: FC<IPaymentSplitterContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPaymentSplitterContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        PaymentSplitterFactoryFacetDeployPaymentSplitterABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployPaymentSplitter(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          payees: values.payees,
          shares: values.shares,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/payment-splitter",
        method: "POST",
        data: {
          payees: values.shares.map(({ payee }: { payee: string }) => payee),
          shares: values.shares.map(({ share }: { share: number }) => share),
        },
      },
      form,
    );
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        className={className}
        dataTestId="PaymentSplitterContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <PaymentSplitterContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
