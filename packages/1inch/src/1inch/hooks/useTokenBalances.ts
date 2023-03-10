import { useEffect, useRef } from "react";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";

import BalanceOfERC20ABI from "./abi/balanceOf.erc20.abi.json";
// import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import { GovernanceTokenAddress, IToken } from "../provider";

export const useTokenBalances = (tokens: Array<IToken>): Record<string, string> => {
  const ref = useRef({} as Record<string, string>);
  const loadTokenBalance = useMetamaskValue(
    async (token: IToken, web3Context: Web3ContextType) => {
      let balance: BigNumber;

      if (ref.current[token.address]) {
        return ref.current[token.address];
      }

      if (token.address === GovernanceTokenAddress) {
        balance = await web3Context.provider!.getBalance(web3Context.account!);
      } else {
        const erc20Contract = new Contract(token.address, BalanceOfERC20ABI, web3Context.provider!.getSigner());
        balance = await erc20Contract.balanceOf(web3Context.account);
      }

      const rtnBalance = formatUnits(balance, BigNumber.from(token.decimals));
      ref.current[token.address] = rtnBalance;

      return rtnBalance;
    },
    { success: false },
  );

  useEffect(() => {
    tokens.forEach(t => {
      loadTokenBalance(t).catch(console.error);
    });
  }, [tokens]); // TODO chainId

  return ref.current;
};
