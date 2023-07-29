import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IToken, TokenStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import UnpackABI from "../../../../../abis/mechanics/mysterybox/unpack/unpack.abi.json";

export interface IMysteryUnpackButtonProps {
  token: IToken;
  refreshPage?: () => Promise<void>;
}

export const MysteryWrapperUnpackButton: FC<IMysteryUnpackButtonProps> = props => {
  const { refreshPage = () => {}, token } = props;

  const metaFn = useMetamask((token: IToken, web3Context: Web3ContextType) => {
    const contract = new Contract(token.template!.contract!.address, UnpackABI, web3Context.provider?.getSigner());
    return contract.unpack(token.tokenId) as Promise<void>;
  });

  const handleUnpack = (token: IToken): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(token).then(() => {
        refreshPage();
      });
    };
  };

  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  return (
    <Button onClick={handleUnpack(token)} data-testid="WrapperUnpackButton">
      <FormattedMessage id="form.buttons.unpack" />
    </Button>
  );
};
