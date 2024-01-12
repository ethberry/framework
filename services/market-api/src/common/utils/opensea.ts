import { parseEther, JsonRpcProvider, Wallet } from "ethers";
import { TokenType } from "@gemunion/types-blockchain";

export interface IPricesFees {
  listing_profit: string;
  royalty_fee: string;
  opensea_fee: string;
}

// TODO move to interfaces (types)

export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5,
}
export const conduitKey = "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";

export const getOpenSeaSigner = (chainId: number): Wallet => {
  // TODO get correct RPC URL from our DB by chainId
  const provider = new JsonRpcProvider(chainId === 11155111 ? "https://rpc.sepolia.org" : "https://rpc.sepolia.org");
  // const signer = new Wallet("0x5905cb7e9a6083a41a18c533e40b52d27da706f4668854f8321e08c457c56d33", provider);
  // WE CAN USE ANY PRIVATE KEY, IT IS NEEDED ONLY FOR SIGN TYPED DATA AND NEVER CHECKS ("@opensea/seaport-js": "3.0.2")
  // TODO get actual private key from secret_manager?
  return new Wallet("0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", provider);
};

export const calculatePricesFees = (price: string, royalty: number): IPricesFees | undefined => {
  try {
    const listing_price = parseEther(price);
    const opensea_fee = (listing_price / 1000n) * 25n;
    const royalty_fee = (listing_price / (100n * 100n)) * BigInt(royalty); // 100 cause percent comes in *100
    const listing_profit = listing_price - opensea_fee - royalty_fee;
    return {
      listing_profit: listing_profit.toString(),
      royalty_fee: royalty_fee.toString(),
      // opensea_fee: ethers.parseEther(String(opensea_fee)).toString(),
      opensea_fee: opensea_fee.toString(),
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// TODO consider options for criteria-based item types (ERC721_WITH_CRITERIA or ERC1155_WITH_CRITERIA)
export const getPriceType = (type: TokenType): ItemType => {
  return type === TokenType.NATIVE
    ? ItemType.NATIVE
    : type === TokenType.ERC20
      ? ItemType.ERC20
      : type === TokenType.ERC1155
        ? ItemType.ERC1155
        : type === TokenType.ERC721
          ? ItemType.ERC721
          : ItemType.NATIVE;
};

export const getItemType = (type: TokenType): number => {
  return type === TokenType.ERC721 || type === TokenType.ERC998 ? 2 : type === TokenType.ERC1155 ? 2 : 0;
};
