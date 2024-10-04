import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import {
  AccessControlEventType,
  ContractType,
  Erc1363EventType,
  ExchangeEventType,
  ModuleType,
  PausableEventType,
  ReferralProgramEventType,
} from "@framework/types";

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
        ExchangeEventType.Purchase,
        ExchangeEventType.Lend,
        ExchangeEventType.LendMany,
        ExchangeEventType.Claim,
        ExchangeEventType.Craft,
        ExchangeEventType.Merge,
        ExchangeEventType.Dismantle,
        ExchangeEventType.PurchaseMysteryBox,
        ExchangeEventType.PurchaseLootBox,
        ExchangeEventType.Upgrade,
        ExchangeEventType.Breed,
        ExchangeEventType.PurchaseLottery,
        ExchangeEventType.PurchaseRaffle,
        // mechanics
        ReferralProgramEventType.ReferralEvent,
        Erc1363EventType.TransferReceived,
        // extensions
        AccessControlEventType.RoleGranted,
        AccessControlEventType.RoleRevoked,
        AccessControlEventType.RoleAdminChanged,
        PausableEventType.Paused,
        PausableEventType.Unpaused,
      ],
    });
  }
}
