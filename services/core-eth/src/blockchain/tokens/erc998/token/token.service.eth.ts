import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
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

import { ABI } from "../../erc721/token/token-log/interfaces";
import { getMetadata } from "../../../../common/utils";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Injectable()
export class Erc998TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly contractManagerService: ContractManagerService,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly templateService: TemplateService,
    protected readonly contractHistoryService: ContractHistoryService,
    protected readonly contractService: ContractService,
  ) {
    super(loggerService, contractManagerService, tokenService, contractHistoryService);
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
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), "1");
    }

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);

    if (from === constants.AddressZero) {
      erc998TokenEntity.template.amount += 1;
      // tokenEntity.template
      //   ? (erc998TokenEntity.template.instanceCount += 1)
      //   : (erc998TokenEntity.erc998Mysterybox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      // erc998TokenEntity.erc998Template.instanceCount -= 1;
      erc998TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc998TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc998TokenEntity.save();

    // need to save updates in nested entities too
    await erc998TokenEntity.template.save();
    await erc998TokenEntity.balance[0].save();

    // erc998TokenEntity.erc998Template
    //   ? await erc998TokenEntity.erc998Template.save()
    //   : await erc998TokenEntity.erc998Mysterybox.erc998Template.save();
  }

  public async mintRandom(event: ILogEvent<ITokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, mysteryboxId },
    } = event;

    const erc998TemplateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!erc998TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let erc998MysteryboxEntity; // if minted as Mechanics reward
    if (~~mysteryboxId !== 0) {
      erc998MysteryboxEntity = await this.tokenService.findOne({ id: ~~mysteryboxId });

      if (!erc998MysteryboxEntity) {
        throw new NotFoundException("mysteryboxNotFound");
      }
    }

    const erc998TokenEntity = await this.tokenService.create({
      tokenId,
      attributes: JSON.stringify({
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      royalty: erc998TemplateEntity.contract.royalty,
      template: erc998TemplateEntity,
      // token: erc998MysteryboxEntity,
    });

    await this.balanceService.create({
      account: to.toLowerCase(),
      amount: "1",
      tokenId: erc998TokenEntity.id,
    });

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IRandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }
}
