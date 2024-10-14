import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { useMetamask } from "@ethberry/react-hooks-eth";

import ERC721WrapperUnpackABI from "@framework/abis/json/ERC721Wrapper/unpack.json";

export interface IWrapperUnpackButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const WrapperUnpackButton: FC<IWrapperUnpackButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const metaFn = useMetamask((token: IToken, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC721WrapperUnpackABI,
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
    <ListAction
      onClick={handleUnpack(token)}
      message="form.buttons.unpack"
      className={className}
      dataTestId="WrapperUnpackButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
