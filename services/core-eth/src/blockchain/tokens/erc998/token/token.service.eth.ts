import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  IErc998TokenReceivedChild,
  IErc998TokenSetMaxChild,
  IErc998TokenTransferChild,
  IErc998TokenUnWhitelistedChild,
  IErc998TokenWhitelistedChild,
  IRandomRequest,
  ITokenMintRandom,
  ITokenTransfer,
  TokenAttributes,
  TokenStatus,
} from "@framework/types";

import { ABI } from "../../erc721/token/log/interfaces";
import { getMetadata } from "../../../../common/utils";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { OwnershipService } from "../ownership/ownership.service";
import { Erc998CompositionService } from "../composition/composition.service";

@Injectable()
export class Erc998TokenServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly tokenService: TokenService,
    protected readonly balanceService: BalanceService,
    protected readonly templateService: TemplateService,
    protected readonly contractHistoryService: ContractHistoryService,
    protected readonly contractService: ContractService,
    protected readonly ownershipService: OwnershipService,
    protected readonly erc998CompositionService: Erc998CompositionService,
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
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
    }

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, contractEntity.id, erc998TokenEntity.id);

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

  public async receivedChild(event: ILogEvent<IErc998TokenReceivedChild>, context: Log): Promise<void> {
    const {
      args: { tokenId, childContract, childTokenId },
    } = event;

    const erc998TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("token998NotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.template.contractId, ~~tokenId);

    const erc721TokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("token721NotFound");
    }

    await this.ownershipService.create({ parentId: erc998TokenEntity.id, childId: erc721TokenEntity.id, amount: 1 });
  }

  public async transferChild(event: ILogEvent<IErc998TokenTransferChild>, context: Log): Promise<void> {
    const {
      args: { childContract, childTokenId },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    const erc721TokenEntity = await this.tokenService.getToken(childTokenId, childContract.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("token721NotFound");
    }

    await this.updateHistory(event, context, parentContractEntity.id, erc721TokenEntity.id);

    const ownershipEntity = await this.ownershipService.findOne({ childId: erc721TokenEntity.id });

    if (!ownershipEntity) {
      throw new NotFoundException("ownershipNotFound");
    }

    await this.ownershipService.delete({ id: ownershipEntity.id });
  }

  public async mintRandom(event: ILogEvent<ITokenMintRandom>, context: Log): Promise<void> {
    // const {
    //   args: { to, tokenId, templateId, randomness },
    // } = event;
    // requestId: string;
    // to: string;
    // randomness: string;
    // templateId: string;
    // tokenId: string;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    // const erc998TemplateEntity = await this.templateService.findOne({ id: ~~templateId });
    //
    // if (!erc998TemplateEntity) {
    //   throw new NotFoundException("templateNotFound");
    // }
    // let erc998MysteryboxEntity; // if minted as Mechanics reward
    // if (~~mysteryboxId !== 0) {
    //   erc998MysteryboxEntity = await this.tokenService.findOne({ id: ~~mysteryboxId });
    //
    //   if (!erc998MysteryboxEntity) {
    //     throw new NotFoundException("mysteryboxNotFound");
    //   }
    // }
    // const erc998TokenEntity = await this.tokenService.create({
    //   tokenId,
    //   attributes: JSON.stringify({
    //     rarity: Object.values(TokenRarity)[~~rarity],
    //   }),
    //   royalty: erc998TemplateEntity.contract.royalty,
    //   template: erc998TemplateEntity,
    //   // token: erc998MysteryboxEntity,
    // });
    //
    // await this.balanceService.create({
    //   account: to.toLowerCase(),
    //   amount: "1",
    //   tokenId: erc998TokenEntity.id,
    // });

    await this.updateHistory(event, context, parentContractEntity.id, void 0);
  }

  public async randomRequest(event: ILogEvent<IRandomRequest>, context: Log): Promise<void> {
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    await this.updateHistory(event, context, parentContractEntity.id, void 0);
  }

  public async whitelistChild(event: ILogEvent<IErc998TokenWhitelistedChild>, context: Log): Promise<void> {
    const {
      args: { addr, maxCount },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    await this.updateHistory(event, context, parentContractEntity.id, void 0);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    await this.erc998CompositionService.create({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
      amount: ~~maxCount,
    });
  }

  public async unWhitelistChild(event: ILogEvent<IErc998TokenUnWhitelistedChild>, context: Log): Promise<void> {
    const {
      args: { addr },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    await this.updateHistory(event, context, parentContractEntity.id, void 0);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    await this.erc998CompositionService.delete({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
    });
  }

  public async setMaxChild(event: ILogEvent<IErc998TokenSetMaxChild>, context: Log): Promise<void> {
    const {
      args: { addr, maxCount },
    } = event;
    const { address } = context;

    const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!parentContractEntity) {
      throw new NotFoundException("contract998NotFound");
    }

    await this.updateHistory(event, context, parentContractEntity.id, void 0);

    const childContractEntity = await this.contractService.findOne({ address: addr.toLowerCase() });

    if (!childContractEntity) {
      throw new NotFoundException("contractChildNotFound");
    }

    const compositionEntity = await this.erc998CompositionService.findOne({
      parentId: parentContractEntity.id,
      childId: childContractEntity.id,
    });

    if (!compositionEntity) {
      throw new NotFoundException("compositionNotFound");
    }

    Object.assign(compositionEntity, { amount: ~~maxCount });
    await compositionEntity.save();
  }
}
