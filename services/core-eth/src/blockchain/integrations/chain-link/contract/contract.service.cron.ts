import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { Contract, Wallet, WeiPerEther } from "ethers";
import { ClientProxy } from "@nestjs/microservices";
import { IsNull, Not } from "typeorm";

import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import { testChainId } from "@framework/constants";
import { EmailType, ModuleType, RmqProviderType } from "@framework/types";

import VrfSol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinatorV2.sol/VRFCoordinatorV2Mock.json";

import { MerchantService } from "../../../../infrastructure/merchant/merchant.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class ChainLinkContractServiceCron {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly merchantService: MerchantService,
  ) {}

  // TODO set up checking schedule and check parameters (minimum balance)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async checkBalance(): Promise<void> {
    const minimum = WeiPerEther * 5n; // TODO set(get) minBalance from VRF contract parameters or settings?
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const vrfCoordinator = await this.contractService.findSystemByName({
      contractModule: ModuleType.CHAIN_LINK,
      chainId,
    });

    const vrfContract = new Contract(vrfCoordinator.address[0], VrfSol.abi, this.signer);

    // get all subscription ids
    const merchantsWithSubs = await this.merchantService.findAll(
      {
        chainLinkSubscriptions: {
          vrfSubId: Not(IsNull()),
          chainId,
        },
      },
      {
        select: {
          email: true,
          chainLinkSubscriptions: true,
        },
        relations: {
          chainLinkSubscriptions: true,
        },
      },
    );

    if (merchantsWithSubs.length > 0) {
      await Promise.allSettled(
        merchantsWithSubs.map(async merchantEntity => {
          try {
            // must be only one VRF subscription per one chainId
            const { balance } = await vrfContract.getSubscription(merchantEntity.chainLinkSubscriptions[0].vrfSubId);

            if (minimum >= BigInt(balance)) {
              return this.emailClientProxy
                .emit<void>(EmailType.LINK_TOKEN, {
                  merchant: merchantEntity,
                })
                .toPromise();
            }
          } catch (e) {
            this.loggerService.error(e, ChainLinkContractServiceCron.name);
          }
        }),
      );
    }
  }
}
