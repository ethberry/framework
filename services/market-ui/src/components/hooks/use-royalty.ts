import { constants, Contract } from "ethers";
import { Fee } from "@bthn/seaport-js/lib/types";
import { useWeb3React } from "@web3-react/core";
import { IErc721Token } from "@framework/types";

import erc721contract from "@framework/binance-contracts/artifacts/@openzeppelin/contracts/interfaces/IERC2981.sol/IERC2981.json";

export const useRoyalty = async (erc721: IErc721Token): Promise<Fee> => {
  const { library } = useWeb3React();

  const contract = new Contract(
    erc721.erc721Template!.erc721Collection!.address,
    erc721contract.abi,
    library.getSigner(),
  );

  const [recipient, amount] = await contract.royaltyInfo(erc721.tokenId, constants.WeiPerEther);

  return {
    recipient,
    basisPoints: constants.WeiPerEther.div(amount).mul(100).toNumber(),
  };
};
