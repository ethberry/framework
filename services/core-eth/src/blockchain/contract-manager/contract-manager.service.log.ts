import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { AccessControlEventSignature, ContractManagerEventSignature, ContractType, ModuleType } from "@framework/types";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ContractManagerABI } from "./interfaces";

@Injectable()
export class ContractManagerServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.CONTRACT_MANAGER,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ContractManagerABI,
      eventSignatures: [
        ContractManagerEventSignature.ERC20TokenDeployed,
        ContractManagerEventSignature.ERC721TokenDeployed,
        ContractManagerEventSignature.ERC998TokenDeployed,
        ContractManagerEventSignature.ERC1155TokenDeployed,
        ContractManagerEventSignature.VestingDeployed,
        ContractManagerEventSignature.MysteryBoxDeployed,
        ContractManagerEventSignature.LootBoxDeployed,
        ContractManagerEventSignature.CollectionDeployed,
        ContractManagerEventSignature.StakingDeployed,
        ContractManagerEventSignature.PonziDeployed,
        ContractManagerEventSignature.PaymentSplitterDeployed,
        ContractManagerEventSignature.LotteryDeployed,
        ContractManagerEventSignature.RaffleDeployed,
        ContractManagerEventSignature.WaitListDeployed,
        // MODULE:ACCESS_CONTROL
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
      ],
    });
  }
}
