import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { TokenType } from "@gemunion/types-blockchain";
import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers";

import ERC20AllowanceABI from "@framework/abis/json/ERC20Simple/allowance.json";
import ERC721IsApprovedForAllABI from "@framework/abis/json/ERC721Simple/isApprovedForAll.json";
import ERC1155IsApprovedForAllABI from "@framework/abis/json/ERC1155Simple/isApprovedForAll.json";

import ERC20ApproveABI from "@framework/abis/json/ERC20Simple/approve.json";
import ERC721SetApprovalForAllABI from "@framework/abis/json/ERC721Simple/setApprovalForAll.json";
import ERC1155SetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

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

export const groupAssetsByContract = (params: Array<IUseAllowanceOptionsParams>) => {
  const result: Record<string, Array<IAsset>> = {};

  for (const param of params) {
    const grouped: Record<string, IAsset> = {};

    for (const asset of param.assets) {
      const { token, tokenType, amount } = asset;

      // If the token doesn't exist in the group, add it.
      if (!grouped[token]) {
        grouped[token] = asset;
      } else {
        // Dublication of the token
        if (tokenType === TokenType.ERC20 && amount /* amount can be undefined */) {
          // If the token is ERC20, combine amount.
          const updatedAmount = BigNumber.from(grouped[token].amount).add(amount);
          grouped[token].amount = updatedAmount;
        } else {
          // If the Token Is 721 / 998 / 1155
          // We just have to skip, for dublicated transactions
          // Skip...
        }
      }
    }

    if (!result[param.contract]) {
      result[param.contract] = Object.values(grouped);
    }
  }

  return result;
};

export const checkAllowance = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, amount = 1n } = asset;
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
    const contractErc721 = new Contract(token, ERC721IsApprovedForAllABI, web3Context.provider?.getSigner());
    return contractErc721.isApprovedForAll(web3Context.account, contract) as boolean;
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155IsApprovedForAllABI, web3Context.provider?.getSigner());
    return contractErc1155.isApprovedForAll(web3Context.account, contract) as boolean;
  }

  // UNKNOWN TOKEN TYPE
  else {
    throw new Error("unsupported token type");
  }
};

export const approveTokens = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, amount = 1n } = asset;

  // ERC20
  if (tokenType === TokenType.ERC20) {
    const contractErc20 = new Contract(token, ERC20ApproveABI, web3Context.provider?.getSigner());
    return contractErc20.approve(contract, amount) as Promise<ContractTransaction>;
  }

  // ERC721 & ERC998
  else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
    const contractErc721 = new Contract(token, ERC721SetApprovalForAllABI, web3Context.provider?.getSigner());
    return contractErc721.setApprovalForAll(contract, true) as Promise<ContractTransaction>;
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155SetApprovalForAllABI, web3Context.provider?.getSigner());
    return contractErc1155.setApprovalForAll(contract, true) as Promise<ContractTransaction>;
  }

  // Unknown Token Type
  else {
    throw new Error("unsupported token type");
  }
};

export const useAllowance = (
  fn: (web3Context: Web3ContextType, ...args: Array<any>) => Promise<any>,
  options: { error?: boolean; success?: boolean } = {},
): ((params: Array<IUseAllowanceOptionsParams>, web3Context: Web3ContextType, ...args: Array<any>) => Promise<any>) => {
  const { error = true } = options;
  const { formatMessage } = useIntl();

  return async (params: Array<IUseAllowanceOptionsParams>, web3Context: Web3ContextType, ...args: Array<any>) => {
    const groupedAssets = groupAssetsByContract(params); // Combine(ERC20) or Remove dublications by tokenAddress

    for (const [contract, assets] of Object.entries(groupedAssets)) {
      for (const asset of assets) {
        try {
          const hasAllowance = await checkAllowance(contract, asset, web3Context);

          if (!hasAllowance) {
            const tx = await approveTokens(contract, asset, web3Context);
            await tx.wait();
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
    }
    return fn(web3Context, ...args);
  };
};
