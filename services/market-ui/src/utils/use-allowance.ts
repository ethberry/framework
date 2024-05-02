import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { TokenType } from "@gemunion/types-blockchain";
import { BigNumber, Contract } from "ethers";

import ERC20AllowanceABI from "@framework/abis/allowance/ERC20.json";
import ERC721GetApprovedABI from "@framework/abis/getApproved/ERC721.json";
import ERC1155IsApprovedForAllABI from "@framework/abis/isApprovedForAll/ERC1155.json";

import ERC20ApproveABI from "@framework/abis/approve/ERC20Blacklist.json";
import ERC721SetApprovalABI from "@framework/abis/approve/ERC721Blacklist.json";
import ERC1155SetApprovalForAllABI from "@framework/abis/setApprovalForAll/ERC1155Blacklist.json";

export interface IUseAllowanceOptionsParams {
  token: string;
  contract: string;
  amount?: BigNumber;
  tokenType: TokenType;
  tokenId?: string | number;
}

export const useAllowance = (
  fn: (...args: Array<any>) => Promise<any>,
  options: { error?: boolean; success?: boolean } = {},
): ((
  params: IUseAllowanceOptionsParams,
  values: Record<string, any> | null,
  web3Context: Web3ContextType,
  ...args: Array<any>
) => Promise<any>) => {
  const { error = true } = options;
  const { formatMessage } = useIntl();

  return async (
    params: IUseAllowanceOptionsParams,
    values: Record<string, any> | null,
    web3Context: Web3ContextType,
    ...args: Array<any>
  ) => {
    try {
      const { amount = 1, token, contract, tokenType, tokenId } = params;
      let hasAllowance = false;

      if (tokenType === TokenType.ERC20) {
        const contractErc20 = new Contract(token, ERC20AllowanceABI, web3Context.provider?.getSigner());
        const allowanceAmount = (await contractErc20.allowance(token, contract)) as number;
        hasAllowance = BigNumber.from(allowanceAmount) >= amount;
      } else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
        console.log("token", token);
        console.log("tokenId", tokenId);
        console.log("contract", contract);
        try {
          const contractErc721 = new Contract(contract, ERC721GetApprovedABI, web3Context.provider?.getSigner());
          const approvedAddress = (await contractErc721.getApproved(tokenId)) as string;
          console.log("approvedAddress", approvedAddress);

          hasAllowance = approvedAddress === contract;
        } catch (error) {
          console.log("error", error);
        }
      } else if (tokenType === TokenType.ERC1155) {
        console.log("token", token);
        console.log("tokenId", tokenId);
        console.log("contract", contract);
        const contractErc1155 = new Contract(token, ERC1155IsApprovedForAllABI, web3Context.provider?.getSigner());
        hasAllowance = (await contractErc1155.isApprovedForAll(token, contract)) as boolean;
        console.log("hasAllowance", hasAllowance);
      } else {
        throw new Error("unsupported token type");
      }

      if (hasAllowance) {
        return fn(values, web3Context, ...args);
      } else {
        if (tokenType === TokenType.ERC20) {
          const contractErc20 = new Contract(token, ERC20ApproveABI, web3Context.provider?.getSigner());
          await contractErc20.approve(contract, amount);
        } else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
          const contractErc721 = new Contract(token, ERC721SetApprovalABI, web3Context.provider?.getSigner());
          await contractErc721.approve(contract, tokenId);
        } else if (tokenType === TokenType.ERC1155) {
          const contractErc1155 = new Contract(token, ERC1155SetApprovalForAllABI, web3Context.provider?.getSigner());
          await contractErc1155.setApprovalForAll(contract, true);
        } else {
          throw new Error("unsupported token type");
        }
        return fn(values, web3Context, ...args);
      }
    } catch (e) {
      if (error) {
        enqueueSnackbar(formatMessage({ id: "snackbar.insufficientAllowance" }), { variant: "error" });
        console.error(`[allowance error] ${formatMessage({ id: "snackbar.insufficientAllowance" })}`, e);
        return null;
      }
      throw new Error(e);
    }
  };
};
