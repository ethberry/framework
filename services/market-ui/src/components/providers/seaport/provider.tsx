import { FC, ReactNode, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Seaport } from "@bthn/seaport-js";
import { ItemType } from "@bthn/seaport-js/lib/constants";
import { Fee } from "@bthn/seaport-js/lib/types";
import { constants, Contract } from "ethers";

import { useLicense } from "@gemunion/provider-license";
import { useWallet } from "@gemunion/provider-wallet";
import IERC2981Sol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/interfaces/IERC2981.sol/IERC2981.json";

import { IAuctionOptions, IErc1155, IErc20, IErc721, SeaportContext } from "./context";

export const DEFAULT_BESU_ACCOUNT = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
export const GEMUNION_SHARES_ADDR = constants.AddressZero;

export interface IWalletProviderProps {
  children?: ReactNode;
  contractAddress?: string;
  defaultConduitKey?: string;
}

export const SeaportProvider: FC<IWalletProviderProps> = props => {
  const { children, contractAddress, defaultConduitKey } = props;

  const [seaport, setSeaport] = useState<Seaport>();

  const { active, library } = useWeb3React();
  const { openConnectWalletDialog } = useWallet();
  const license = useLicense();

  const calculateRoyalty = async (erc721: IErc721): Promise<Fee> => {
    const { library } = useWeb3React();

    const contract = new Contract(erc721.address, IERC2981Sol.abi, library.getSigner());

    const [recipient, amount] = await contract.royaltyInfo(erc721.tokenId, constants.WeiPerEther);

    return {
      recipient,
      basisPoints: constants.WeiPerEther.div(amount).mul(100).toNumber(),
    };
  };

  const calculateFees = (_erc721: IErc721) => {
    const fees = [];

    // const royalty = useRoyalty(erc721);
    //
    // if (royalty.basisPoints > 0 && royalty.basisPoints < 1_000) {
    //   fees.push(royalty);
    // }

    fees.push({
      recipient: process.env.ACCOUNT,
      basisPoints: 500,
    });

    if (process.env.ACCOUNT !== DEFAULT_BESU_ACCOUNT) {
      fees.push({
        recipient: GEMUNION_SHARES_ADDR,
        basisPoints: 100,
      });
    }

    return fees;
  };

  const sellErc721ForErc20 = async (options: IAuctionOptions, erc721: IErc721, erc20: IErc20) => {
    if (!active) {
      openConnectWalletDialog();
      throw new Error("walletIsNotConnected");
    }

    const { executeAllActions } = await seaport!.createOrder({
      offer: [
        {
          itemType: ItemType.ERC721,
          token: erc721.address,
          identifier: erc721.tokenId,
        },
      ],
      consideration: [
        {
          token: erc20.address,
          amount: erc20.minAmount,
          endAmount: erc20.maxAmount,
        },
      ],
      nonce: options.nonce,
      startTime: options.startDate ? Math.ceil(new Date(options.startDate).getTime() / 1000).toString() : void 0,
      endTime: options.endDate ? Math.ceil(new Date(options.endDate).getTime() / 1000).toString() : void 0,
      fees: calculateFees(erc721),
    });

    return executeAllActions();
  };

  const sellErc1155ForErc20 = async (options: IAuctionOptions, erc1155: IErc1155, erc20: IErc20) => {
    if (!active) {
      openConnectWalletDialog();
      throw new Error("walletIsNotConnected");
    }

    const { executeAllActions } = await seaport!.createOrder({
      offer: [
        {
          itemType: ItemType.ERC1155,
          token: erc1155.address,
          identifier: erc1155.tokenId,
          amount: erc1155.amount,
        },
      ],
      consideration: [
        {
          token: erc20.address,
          amount: erc20.minAmount,
          endAmount: erc20.maxAmount,
        },
      ],
      nonce: options.nonce,
      startTime: options.startDate ? Math.ceil(new Date(options.startDate).getTime() / 1000).toString() : void 0,
      endTime: options.endDate ? Math.ceil(new Date(options.endDate).getTime() / 1000).toString() : void 0,
      fees: calculateFees(erc1155),
    });

    return executeAllActions();
  };

  const getNonce = (address: string) => {
    if (!active) {
      openConnectWalletDialog();
      throw new Error("walletIsNotConnected");
    }

    return seaport!.getNonce(address);
  };

  const bulkCancelOrders = async () => {
    if (!active) {
      openConnectWalletDialog();
      throw new Error("walletIsNotConnected");
    }

    const transaction = await seaport!.bulkCancelOrders().transact();
    await transaction.wait();
  };

  useEffect(() => {
    if (active) {
      setSeaport(new Seaport(library, { overrides: { contractAddress, defaultConduitKey } }));
    } else {
      setSeaport(void 0);
    }
  }, [active]);

  if (!license.isValid()) {
    return null;
  }

  return (
    <SeaportContext.Provider
      value={{
        getNonce,
        bulkCancelOrders,
        calculateRoyalty,
        sellErc721ForErc20,
        sellErc1155ForErc20,
      }}
    >
      {children}
    </SeaportContext.Provider>
  );
};
