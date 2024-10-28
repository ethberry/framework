import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useNavigate } from "react-router";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ModuleType, TokenStatus } from "@framework/types";

import ERC721WrapperUnpackABI from "@framework/abis/json/ERC721Wrapper/unpack.json";

export interface IWrapperUnpackButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const WrapperBoxUnpackButton: FC<IWrapperUnpackButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const navigate = useNavigate();

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
        navigate("/tokens");
      });
    };
  };

  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  if (token.template?.contract?.contractModule !== ModuleType.WRAPPER) {
    return null;
  }

  return (
    <ListAction
      onClick={handleUnpack(token)}
      message="form.buttons.unpack"
      className={className}
      dataTestId="WrapperUnpackButton"
      disabled={disabled || token.template?.contract?.isPaused}
      variant={variant}
    />
  );
};
