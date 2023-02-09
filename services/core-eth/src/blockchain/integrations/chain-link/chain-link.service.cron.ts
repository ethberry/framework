import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { constants, Contract, Wallet } from "ethers";
import { In } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { ContractFeatures, EmailType, RmqProviderType } from "@framework/types";
import LinkSol from "@framework/core-contracts/artifacts/contracts/ThirdParty/LinkToken.sol/LinkToken.json";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkServiceCron {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async random(): Promise<void> {
    const linkAddr = this.configService.get<string>("LINK_ADDR", "");
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL", "");

    const contractEntities = await this.contractService.findAll({
      contractFeatures: In([ContractFeatures.RANDOM]),
    });

    const contract = new Contract(linkAddr, LinkSol.abi, this.signer);
    const minimum = constants.WeiPerEther.mul(5);

    await Promise.allSettled(
      contractEntities.map(async contractEntity => {
        const balance = await contract.balanceOf(contractEntity.address);
        if (minimum.gte(balance)) {
          return this.emailClientProxy
            .emit<void>(EmailType.LINK_TOKEN, {
              user: { email: adminEmail },
              contract: contractEntity,
            })
            .toPromise();
        }
      }),
    );
  }
}
