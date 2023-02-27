import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IToken } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC721WrapperSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Wrapper/ERC721Wrapper.sol/ERC721Wrapper.json";

export interface IWrapperUnpackButtonProps {
  token: IToken;
}

export const WrapperUnpackButton: FC<IWrapperUnpackButtonProps> = props => {
  const { token } = props;

  const metaFn = useMetamask((token: IToken, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC721WrapperSol.abi,
      web3Context.provider?.getSigner(),
    );
    return contract.unpack(token.tokenId) as Promise<void>;
  });

  const handleUnpack = (token: IToken): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFn(token).then(() => {
        // TODO reload page
      });
    };
  };

  return (
    <Button onClick={handleUnpack(token)} data-testid="WrapperUnpackButton">
      <FormattedMessage id="form.buttons.unwrap" />
    </Button>
  );
};
