import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interface } from "ethers";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { CollectionEventSignature } from "@framework/types";
import ERC721CollectionSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CollectionSimple.sol/ERC721CollectionSimple.json";

import { ContractType } from "../../../../utils/contract-type";

@Injectable()
export class CollectionServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly ethersService: EthersService,
  ) {}

  public readLastBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.getPastEvents(
      [
        {
          contractType: ContractType.COLLECTION,
          contractAddress: address,
          contractInterface: new Interface(ERC721CollectionSol.abi),
          eventSignatures: [CollectionEventSignature.ConsecutiveTransfer],
        },
      ],
      blockNumber,
      blockNumber,
    );
  }
}
