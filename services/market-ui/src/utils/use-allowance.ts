import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { TokenType } from "@gemunion/types-blockchain";
import { BigNumber, BigNumberish, Contract } from "ethers";

import ERC20AllowanceABI from "@framework/abis/allowance/ERC20.json";
import ERC721GetApprovedABI from "@framework/abis/getApproved/ERC721.json";
import ERC1155IsApprovedForAllABI from "@framework/abis/isApprovedForAll/ERC1155.json";

import ERC20ApproveABI from "@framework/abis/approve/ERC20Blacklist.json";
import ERC721SetApprovalABI from "@framework/abis/approve/ERC721Blacklist.json";
import ERC1155SetApprovalForAllABI from "@framework/abis/setApprovalForAll/ERC1155Blacklist.json";

// Where to import IAsset?
interface IAsset {
  token: string;
  amount?: BigNumberish;
  tokenType: TokenType;
  tokenId?: string | number;
}

export interface IUseAllowanceOptionsParams {
  contract: string;
  assets: IAsset[];
}

export const useAllowance = (
  fn: (...args: Array<any>) => Promise<any>,
  options: { error?: boolean; success?: boolean } = {},
): ((params: IUseAllowanceOptionsParams, web3Context: Web3ContextType, ...args: Array<any>) => Promise<any>) => {
  const { error = true } = options;
  const { formatMessage } = useIntl();

  return async (params: IUseAllowanceOptionsParams, web3Context: Web3ContextType, ...args: Array<any>) => {
    for (const asset of params.assets) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const hasAllowance = await checkAllowance(params.contract, asset, web3Context);

        if (!hasAllowance) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          await approveTokens(params.contract, asset, web3Context);
        }
      } catch (e) {
        if (error) {
          enqueueSnackbar(formatMessage({ id: "snackbar.insufficientAllowance" }), { variant: "error" });
          console.error(`[allowance error] ${formatMessage({ id: "snackbar.insufficientAllowance" })}`, e);
          return null;
        }
        throw new Error(e);
      }
    }
    return fn(web3Context, ...args);
  };
};

export const checkAllowance = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, tokenId, amount = 1n } = asset;
  // NATIVE
  if (tokenType === TokenType.NATIVE) {
    return true;
  }

  // ERC20
  else if (tokenType === TokenType.ERC20) {
    const contractErc20 = new Contract(token, ERC20AllowanceABI, web3Context.provider?.getSigner());
    const allowanceAmount = (await contractErc20.allowance(web3Context.account, contract)) as number;
    return BigNumber.from(allowanceAmount).gte(amount);
  }

  // ERC721 & ERC998
  else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
    const contractErc721 = new Contract(contract, ERC721GetApprovedABI, web3Context.provider?.getSigner());
    const approvedAddress = (await contractErc721.getApproved(tokenId)) as string;
    return approvedAddress === contract;
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155IsApprovedForAllABI, web3Context.provider?.getSigner());
    return (await contractErc1155.isApprovedForAll(web3Context.account, contract)) as boolean;
  }

  // UNKNOWN TOKEN TYPE
  else {
    throw new Error("unsupported token type");
  }
};

export const approveTokens = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, tokenId, amount = 1n } = asset;

  // ERC20
  if (tokenType === TokenType.ERC20) {
    const contractErc20 = new Contract(token, ERC20ApproveABI, web3Context.provider?.getSigner());
    await contractErc20.approve(contract, amount);
  }

  // ERC721 & ERC998
  else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
    const contractErc721 = new Contract(token, ERC721SetApprovalABI, web3Context.provider?.getSigner());
    await contractErc721.approve(contract, tokenId);
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155SetApprovalForAllABI, web3Context.provider?.getSigner());
    await contractErc1155.setApprovalForAll(contract, true);
  }

  // Unknown Token Type
  else {
    throw new Error("unsupported token type");
  }
};
