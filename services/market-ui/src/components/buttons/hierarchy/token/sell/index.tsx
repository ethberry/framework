import { FC, Fragment, useState } from "react";
import { Sell } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useAppSelector } from "@gemunion/redux";
import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyPrice } from "@gemunion/mui-inputs-asset";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";
import { ISellDto, SellDialog } from "./dialog";

interface ITokenSellButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const TokenSellButton: FC<ITokenSellButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;
  const { referrer } = useAppSelector(state => state.settings);
  const { account, chainId } = useWeb3React();

  // disable SELL for unsupported chains (BESU, GEMUNIONBESU, BSC, BSC_testnet etc)
  if (chainId === 56 || chainId === 97 || chainId === 10000 || chainId === 10001) {
    return null;
  }
  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const metaFn = useMetamask((dto: Array<any>, web3Context: Web3ContextType) => {
    const signer = web3Context.provider?.getSigner();

    return Promise.all(
      dto.map(async tx => {
        return signer?.sendTransaction(tx);
      }),
    );
  });

  const { fn } = useApiCall(
    async (api, values: ISellDto) => {
      return api.fetchJson({
        url: `/marketplace/sell`,
        method: "POST",
        data: {
          chainId,
          account,
          referrer,
          tokenId: token.id,
          amount: 1,
          endTimestamp: values.endTimestamp,
          price: {
            components: [
              {
                tokenType: values.price.components[0].tokenType,
                contractId: values.price.components[0].contractId,
                templateId: values.price.components[0].templateId,
                amount: values.price.components[0].amount,
              },
            ],
          },
        },
      });
    },
    { success: false },
  );

  const handleSellConfirm = async (values: Partial<ISellDto>, form: any) => {
    return fn(form, values)
      .then(async resp => {
        return await metaFn(resp);
      })
      .finally(() => {
        setIsSellDialogOpen(false);
      });
  };

  const handleSell = () => {
    setIsSellDialogOpen(true);
  };

  const handleSellCancel = () => {
    setIsSellDialogOpen(false);
  };

  // TIME + 1 day from Now
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return (
    <Fragment>
      <ListAction
        icon={Sell}
        onClick={handleSell}
        message="form.buttons.sell"
        className={className}
        dataTestId="TokenSellButton"
        disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
        variant={variant}
      />
      <SellDialog
        onConfirm={handleSellConfirm}
        onCancel={handleSellCancel}
        open={isSellDialogOpen}
        initialValues={{
          price: emptyPrice,
          endTimestamp: date.toISOString(),
        }}
      />
    </Fragment>
  );
};
