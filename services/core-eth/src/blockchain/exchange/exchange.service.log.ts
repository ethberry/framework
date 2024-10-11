import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ExchangeEventSignature, ModuleType } from "@framework/types";

import { ContractType } from "../../utils/contract-type";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ExchangeABI } from "./interfaces";

@Injectable()
export class ExchangeServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.EXCHANGE,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.EXCHANGE,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ExchangeABI,
      eventSignatures: [
        ExchangeEventSignature.Purchase,
        ExchangeEventSignature.Lend,
        ExchangeEventSignature.LendMany,
        ExchangeEventSignature.Claim,
        ExchangeEventSignature.Craft,
        ExchangeEventSignature.Merge,
        ExchangeEventSignature.Dismantle,
        ExchangeEventSignature.PurchaseMysteryBox,
        ExchangeEventSignature.PurchaseLootBox,
        ExchangeEventSignature.Upgrade,
        ExchangeEventSignature.Breed,
        ExchangeEventSignature.PurchaseLottery,
        ExchangeEventSignature.PurchaseRaffle,
      ],
    });
  }
}
