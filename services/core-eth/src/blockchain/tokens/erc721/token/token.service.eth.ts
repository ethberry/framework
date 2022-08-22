import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  IRandomRequest,
  ITokenMintRandom,
  ITokenTransfer,
  TokenAttributes,
  TokenRarity,
  TokenStatus,
} from "@framework/types";

import { ABI } from "./log/interfaces";
import { getMetadata } from "../../../../common/utils";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Injectable()
export class Erc721TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly configService: ConfigService,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly contractHistoryService: ContractHistoryService,
  ) {
    super(loggerService, contractService, tokenService, contractHistoryService);
  }

  public async transfer(event: ILogEvent<ITokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // Mint token create
    if (from === constants.AddressZero) {
      const attributes = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider);
      const templateId = ~~attributes[TokenAttributes.TEMPLATE_ID];
      const templateEntity = await this.templateService.findOne({ id: templateId });
      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes: JSON.stringify(attributes),
        royalty: contractEntity.royalty,
        templateId: templateEntity.id,
      });
      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.template.amount += 1;
      // erc721TokenEntity.erc721Template
      //   ? (erc721TokenEntity.erc721Template.instanceCount += 1)
      //   : (erc721TokenEntity.erc721Mysterybox.erc721Template.instanceCount += 1);
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      // erc721TokenEntity.erc721Template.instanceCount -= 1;
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();

    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
    // erc721TokenEntity.erc721Template

    //   ? await erc721TokenEntity.template.save()
    //   : await erc721TokenEntity.mysterybox.template.save();
  }

  public async mintRandom(event: ILogEvent<ITokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, mysteryboxId },
    } = event;

    const templateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let mysteryboxEntity; // if minted as Mechanics reward
    if (~~mysteryboxId !== 0) {
      mysteryboxEntity = await this.tokenService.findOne({ id: ~~mysteryboxId });

      if (!mysteryboxEntity) {
        throw new NotFoundException("mysteryboxNotFound");
      }
    }

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes: JSON.stringify({
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
      // erc721Token: mysteryboxEntity,
    });

    await this.balanceService.create({
      account: to.toLowerCase(),
      amount: "1",
      tokenId: tokenEntity.id,
    });

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IRandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }
}
