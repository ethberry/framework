import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils, BigNumber } from "ethers";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";

import type { IToken } from "@framework/types";
import { TokenType } from "@framework/types";

// import ERC4907ABI from "../../../../../abis/components/buttons/hierarchy/token/lend/erc4907.abi.json";

import { ILendDto, LendDialog } from "./dialog";
import TemplateLendABI from "../../../../../abis/components/buttons/hierarchy/template/lend/lend.abi.json";
import { getEthPrice } from "../../../../../utils/money";

interface ITokenLendButtonProps {
  token: IToken;
}

export const TokenLendButton: FC<ITokenLendButtonProps> = props => {
  const { token } = props;

  const [isLendTokenDialogOpen, setIsLendTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFnWithSign = useServerSignature(
    (values: ILendDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const expires = Math.ceil(new Date(values.expires).getTime() / 1000); // in seconds,
      const contract = new Contract(process.env.EXCHANGE_ADDR, TemplateLendABI, web3Context.provider?.getSigner());

      const params = {
        nonce: utils.arrayify(sign.nonce),
        externalId: expires,
        expiresAt: sign.expiresAt,
        referrer: values.account,
      };
      const items = [
        {
          tokenType: Object.keys(TokenType).indexOf(token.template!.contract!.contractType),
          token: token.template!.contract?.address,
          tokenId: token.tokenId,
          amount: 1,
        },
      ];

      const price = token.template?.contract?.rent
        ? token.template?.contract?.rent[0]?.price?.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            // pass templateId instead of tokenId = 0
            tokenId:
              component.template!.tokens![0].tokenId === "0"
                ? component.template!.tokens![0].templateId
                : component.template!.tokens![0].tokenId,
            amount: component.amount,
          }))
        : [];
      return contract.lend(params, items, price, sign.signature, {
        value: token.template?.contract?.rent
          ? getEthPrice(token.template?.contract?.rent[0].price)
          : BigNumber.from(0),
      }) as Promise<void>;
    },
  );

  const metaFn = useMetamask((dto: ILendDto, web3Context: Web3ContextType) => {
    const { account } = web3Context;
    const expires = Math.ceil(new Date(dto.expires).getTime() / 1000); // in seconds,

    return metaFnWithSign(
      {
        url: "/rent/tokens/sign",
        method: "POST",
        data: {
          tokenId: token.id, // token.id to lend
          account, // user owner
          referrer: dto.account, // borrower
          externalId: expires,
        },
      },
      dto,
      web3Context,
    );
  });

  // function setUser(uint256 tokenId, address user, uint64 expires) public virtual {
  // const metaFn1 = useMetamask((dto: ILendDto, web3Context: Web3ContextType) => {
  //   const contract = new Contract(token.template!.contract!.address, ERC4907ABI, web3Context.provider?.getSigner());
  //   const expires = Math.ceil(new Date(dto.expires).getTime() / 1000); // in seconds,
  //   console.log("dto", dto);
  //   return contract.setUser(token.tokenId, dto.account, expires) as Promise<any>;
  // });

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
        }}
      />
    </Fragment>
  );
};
