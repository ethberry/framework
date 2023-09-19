import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";

import type { IContractSearchDto, ILotteryScheduleUpdateDto } from "@framework/types";
import { ModuleType, RmqProviderType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    @Inject(RmqProviderType.SCHEDULE_SERVICE_LOTTERY)
    private readonly scheduleProxy: ClientProxy,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository, configService);
  }

  public search(dto: Partial<IContractSearchDto>, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.LOTTERY], null);
  }

  public async updateSchedule(
    where: FindOptionsWhere<ContractEntity>,
    dto: ILotteryScheduleUpdateDto,
    userEntity: UserEntity,
  ): Promise<any> {
    const lotteryEntity = await this.findOne(where);

    if (!lotteryEntity) {
      throw new NotFoundException("lotteryNotFound");
    }

    if (lotteryEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    await this.updateParameter(where, "schedule", dto.schedule);

    return this.scheduleProxy
      .emit(RmqProviderType.SCHEDULE_SERVICE_LOTTERY, {
        address: lotteryEntity.address,
        schedule: dto.schedule,
      })
      .toPromise();
  }
}
