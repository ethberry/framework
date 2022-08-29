import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Sell } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IVesting } from "@framework/types";
import { TokenType } from "@framework/types";

import { emptyPrice } from "../../../../inputs/price/empty-price";
import { IVestingSellDto, VestingSellDialog } from "./dialog";

interface IVestingSellButtonProps {
  vesting: IVesting;
}

export const VestingSellButton: FC<IVestingSellButtonProps> = props => {
  const { vesting } = props;

  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const { fn } = useApiCall((api, values) => {
    return api.fetchJson({
      url: "/vesting",
      method: "POST",
      data: values,
    });
  });

  const metaFn = useMetamask(
    async (dto: IVestingSellDto, web3Context: Web3ContextType) => {
      const signer = web3Context.provider!.getSigner();
      const nonce = utils.randomBytes(32);

      // TODO remove @ts-ignore
      const price = dto.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        // @ts-ignore
        token: component.address,
        tokenId: component.templateId,
        amount: component.amount,
      }));

      const signature = await signer._signTypedData(
        // Domain
        {
          name: "Vesting",
          version: "1.0.0",
          chainId: process.env.CHAIN_ID,
          verifyingContract: vesting.address,
        },
        // Types
        {
          EIP712: [
            { name: "account", type: "address" },
            { name: "params", type: "Params" },
            { name: "items", type: "Asset[]" },
            { name: "price", type: "Asset[]" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "externalId", type: "uint256" },
            { name: "expiresAt", type: "uint256" },
            { name: "referrer", type: "address" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          account: dto.account,
          params: {
            nonce,
            externalId: 0,
            expiresAt: 0,
            referrer: constants.AddressZero,
          },
          items: [],
          price,
        },
      );

      return fn(void 0, {
        account: dto.account,
        nonce: utils.hexlify(nonce),
        signature,
        price,
      });
    },
    { success: false },
  );

  const handleSell = (): void => {
    setIsSellDialogOpen(true);
  };

  const handleSellConfirm = async (dto: IVestingSellDto) => {
    await metaFn(dto);
    setIsSellDialogOpen(false);
  };

  const handleSellCancel = () => {
    setIsSellDialogOpen(false);
  };

  return (
    <Fragment>
      <Button onClick={handleSell} startIcon={<Sell />} data-testid="VestingSellButton">
        <FormattedMessage id="form.buttons.sell" />
      </Button>
      <VestingSellDialog
        onConfirm={handleSellConfirm}
        onCancel={handleSellCancel}
        open={isSellDialogOpen}
        initialValues={{
          account: "",
          price: emptyPrice,
        }}
      />
    </Fragment>
  );
};
