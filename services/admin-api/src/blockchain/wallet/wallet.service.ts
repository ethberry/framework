import { Injectable, NotFoundException } from "@nestjs/common";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { BalanceEntity } from "../hierarchy/balance/balance.entity";
import { IBalanceSearchDto, ModuleType } from "@framework/types";
import { ContractService } from "../hierarchy/contract/contract.service";
import { TemplateEntity } from "../hierarchy/template/template.entity";

@Injectable()
export class WalletService {
  constructor(protected readonly balanceService: BalanceService, protected readonly contractService: ContractService) {}

  public async getExchangeBalance(dto: IBalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    const exchangeContractEntity = await this.contractService.findOne({
      contractModule: ModuleType.SYSTEM,
      title: "EXCHANGE",
    });

    if (!exchangeContractEntity) {
      throw new NotFoundException("entityNotFound");
    }

    return this.balanceService.search(dto, exchangeContractEntity.address);
  }
}
