import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils, BigNumber } from "ethers";

import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";

import type { IToken } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";
import { ILendDto, LendDialog } from "./dialog";
import TemplateLendABI from "../../../../../abis/components/buttons/mechanics/lend/lend.abi.json";
import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface ITokenLendButtonProps {
  token: IToken;
}

export const TokenLendButton: FC<ITokenLendButtonProps> = props => {
  const { token } = props;
  const [isLendTokenDialogOpen, setIsLendTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFnWithSign = useServerSignature(
    (values: ILendDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const timeEnd = Math.ceil(new Date(values.expires).getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(utils.hexlify(timeEnd), 32);

      const contract = new Contract(process.env.EXCHANGE_ADDR, TemplateLendABI, web3Context.provider?.getSigner());

      const params = {
        nonce: utils.arrayify(sign.nonce),
        externalId: values.rentRule, // DB rent rule id
        expiresAt: sign.expiresAt,
        referrer: values.account,
      };
      const items = [
        {
          tokenType: Object.values(TokenType).indexOf(token.template!.contract!.contractType),
          token: token.template!.contract?.address,
          tokenId: token.tokenId,
          amount: 1,
        },
      ];

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
        : []; // Zero price for free rent?
      return contract.lend(params, items, price, expires, sign.signature, {
        value: rentRule ? getEthPrice(rentRule[0].price) : BigNumber.from(0),
      }) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((dto: ILendDto, web3Context: Web3ContextType) => {
    const { account } = web3Context;
    const expires = Math.ceil(new Date(dto.expires).getTime() / 1000); // in seconds,

    return metaFnWithSign(
      {
        url: "/rent/tokens/sign",
        method: "POST",
        data: {
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
      <Tooltip title={formatMessage({ id: "form.tips.lend" })}>
        <Button onClick={handleLend} data-testid="TokenLendButton">
          <FormattedMessage id="form.buttons.lend" />
        </Button>
      </Tooltip>
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
