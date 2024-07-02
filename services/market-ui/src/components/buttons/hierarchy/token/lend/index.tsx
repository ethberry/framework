import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  convertTemplateToChainAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import TemplateLendABI from "@framework/abis/lend/ExchangeRentableFacet.json";

import type { ILendDto } from "./dialog";
import { LendDialog } from "./dialog";
import { useAllowance } from "../../../../../utils/use-allowance";

interface ITokenLendButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const TokenLendButton: FC<ITokenLendButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;
  const [isLendTokenDialogOpen, setIsLendTokenDialogOpen] = useState(false);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, values: ILendDto, sign: IServerSignature, systemContract: IContract) => {
      const timeEnd = Math.ceil(new Date(values.expires).getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(utils.hexlify(timeEnd), 32);

      const contract = new Contract(systemContract.address, TemplateLendABI, web3Context.provider?.getSigner());

      const params = {
        externalId: values.rentRule, // DB rent rule id
        expiresAt: sign.expiresAt,
        nonce: utils.arrayify(sign.nonce),
        extra: expires,
        receiver: token.template?.contract?.merchant!.wallet,
        referrer: values.account,
      };
      const item = convertTemplateToChainAsset(token.template, 1);

      const rentRule = token.template?.contract?.rent
        ? token.template?.contract?.rent.filter(r => r.id === values.rentRule)
        : [];

      const price = convertDatabaseAssetToChainAsset(rentRule ? rentRule[0].price?.components : []);

      // TODO - test
      return contract.lend(params, item, price, sign.signature, {
        value: rentRule ? getEthPrice(rentRule[0].price) : BigNumber.from(0),
      }) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (values: ILendDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const rentRule = token.template?.contract?.rent
        ? token.template?.contract?.rent.filter(r => r.id === values.rentRule)
        : [];

      const price = convertDatabaseAssetToTokenTypeAsset(rentRule ? rentRule[0].price?.components : []);

      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
        web3Context,
        values,
        sign,
        systemContract,
      );
    },
    // { error: false },
  );

  const metaFn = useMetamask((values: ILendDto, web3Context: Web3ContextType) => {
    const expires = Math.ceil(new Date(values.expires).getTime() / 1000); // in seconds,

    return metaFnWithSign(
      {
        url: "/rent/tokens/sign",
        method: "POST",
        data: {
          referrer: values.account, // borrower
          tokenId: token.id, // token.id to lend
          externalId: values.rentRule, // DB rent rule id
          expires, // lend time
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
  });

  const handleLend = (): void => {
    setIsLendTokenDialogOpen(true);
  };

  const handleLendConfirm = async (dto: ILendDto) => {
    await metaFn(dto).finally(() => {
      setIsLendTokenDialogOpen(false);
    });
  };

  const handleLendCancel = () => {
    setIsLendTokenDialogOpen(false);
  };

  if (!token.template!.contract?.contractFeatures.includes(ContractFeatures.RENTABLE)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleLend}
        message="form.buttons.lend"
        className={className}
        dataTestId="TokenLendButton"
        disabled={disabled}
        variant={variant}
      />
      <LendDialog
        onConfirm={handleLendConfirm}
        onCancel={handleLendCancel}
        open={isLendTokenDialogOpen}
        message="dialogs.lend"
        testId="LendTokenDialogForm"
        initialValues={{
          account: "",
          expires: new Date().toISOString(),
          contractId: token.template!.contract.id,
          rentRule: 0, // externalId
        }}
      />
    </Fragment>
  );
};
