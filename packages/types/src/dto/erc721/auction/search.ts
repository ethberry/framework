import { ISortDto } from "@gemunion/types-collection";

import { Erc721AuctionStatus, IErc721Auction } from "../../../entities";

export interface IErc721AuctionSearchDto extends ISortDto<IErc721Auction> {
  minPrice: string;
  maxPrice: string;
  owner: string;
  auctionStatus: Array<Erc721AuctionStatus>;
}
