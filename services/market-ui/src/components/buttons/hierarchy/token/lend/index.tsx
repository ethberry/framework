import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import TemplateLendABI from "../../../../../abis/mechanics/rentable/lend.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";
import { ILendDto, LendDialog } from "./dialog";

interface ITokenLendButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const TokenLendButton: FC<ITokenLendButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;
  const [isLendTokenDialogOpen, setIsLendTokenDialogOpen] = useState(false);

  const metaFnWithSign = useServerSignature(
    (values: ILendDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const timeEnd = Math.ceil(new Date(values.expires).getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(utils.hexlify(timeEnd), 32);

      const contract = new Contract(process.env.EXCHANGE_ADDR, TemplateLendABI, web3Context.provider?.getSigner());

      const params = {
        externalId: values.rentRule, // DB rent rule id
        expiresAt: sign.expiresAt,
        nonce: utils.arrayify(sign.nonce),
        extra: expires,
        receiver: token.template?.contract?.merchant!.wallet,
        referrer: values.account,
      };
      const item = {
        tokenType: Object.values(TokenType).indexOf(token.template!.contract!.contractType!),
        token: token.template!.contract?.address,
        tokenId: token.tokenId,
        amount: 1,
      };

      const rentRule = token.template?.contract?.rent
        ? token.template?.contract?.rent.filter(r => r.id === values.rentRule)
        : [];

      const price = rentRule
        ? rentRule[0].price?.components.sort(sorter("id")).map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            // pass templateId instead of tokenId = 0
            tokenId:
              component.template!.tokens![0].tokenId === "0"
                ? component.template!.tokens![0].templateId
                : component.template!.tokens![0].tokenId,
            amount: component.amount,
          }))
        : []; // Zero price for free rent
      return contract.lend(params, item, price, sign.signature, {
        value: rentRule ? getEthPrice(rentRule[0].price) : BigNumber.from(0),
      }) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((dto: ILendDto, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;
    const expires = Math.ceil(new Date(dto.expires).getTime() / 1000); // in seconds,

    return metaFnWithSign(
      {
        url: "/rent/tokens/sign",
        method: "POST",
        data: {
          chainId,
          account, // user token owner
          referrer: dto.account, // borrower
          tokenId: token.id, // token.id to lend
          externalId: dto.rentRule, // DB rent rule id
          expires, // lend time
        },
      },
      dto,
      web3Context,
    );
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
