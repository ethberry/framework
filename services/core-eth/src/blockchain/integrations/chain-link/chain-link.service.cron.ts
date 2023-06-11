import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { WeiPerEther, Contract, Wallet } from "ethers";
import { ClientProxy } from "@nestjs/microservices";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { EmailType, RmqProviderType } from "@framework/types";
import VrfSol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkServiceCron {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async random(): Promise<void> {
    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const subscriptionId = this.configService.get<string>("CHAINLINK_SUBSCRIPTION_ID", "1");
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL", "");

    const contract = new Contract(vrfAddr, VrfSol.abi, this.signer);
    const minimum = WeiPerEther * 5n; // TODO set(get) subID and minBalance in VRF contract parameters?

    try {
      const { balance } = await contract.getSubscription(subscriptionId);
      if (minimum >= BigInt(balance)) {
        return this.emailClientProxy
          .emit<void>(EmailType.LINK_TOKEN, {
            user: { email: adminEmail },
            subscription: subscriptionId,
          })
          .toPromise();
      }
    } catch (e) {
      this.loggerService.error(e, ChainLinkServiceCron.name);
    }
  }
}
