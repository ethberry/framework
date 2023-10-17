import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersContractService } from "@gemunion/nest-js-module-ethers-gcp";

import { ModuleType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkSubLogService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly ethersContractService: EthersContractService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async updateBlock(): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const vrfCoordinator = await this.contractService.findSystemByName({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    await this.contractService.updateLastBlockByAddr(
      vrfCoordinator.address[0],
      this.ethersContractService.getLastBlockOption(),
    );
  }
}
