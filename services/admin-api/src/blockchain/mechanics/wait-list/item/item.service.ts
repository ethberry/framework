import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IWaitListItemCreateDto, IWaitListItemSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListListService } from "../list/list.service";
import { WaitListItemEntity } from "./item.entity";

@Injectable()
export class WaitListItemService {
  constructor(
    @InjectRepository(WaitListItemEntity)
    private readonly waitListItemEntityRepository: Repository<WaitListItemEntity>,
    @Inject(forwardRef(() => WaitListListService))
    private readonly waitListListService: WaitListListService,
  ) {}

  public async search(
    dto: Partial<IWaitListItemSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<WaitListItemEntity>, number]> {
    const { skip, take, account, listIds } = dto;

    const queryBuilder = this.waitListItemEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    queryBuilder.leftJoin("waitlist.list", "list");
    queryBuilder.addSelect(["list.title", "list.contract", "list.root"]);

    queryBuilder.leftJoin("list.contract", "contract");
    queryBuilder.addSelect(["contract.contractStatus"]);

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (listIds) {
      if (listIds.length === 1) {
        queryBuilder.andWhere("waitlist.listId = :listId", {
          listId: listIds[0],
        });
      } else {
        queryBuilder.andWhere("waitlist.listId IN(:...listIds)", { listIds });
      }
    }

    if (account) {
      queryBuilder.andWhere("waitlist.account ILIKE '%' || :account || '%'", { account });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "waitlist.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WaitListItemEntity>,
    options?: FindOneOptions<WaitListItemEntity>,
  ): Promise<WaitListItemEntity | null> {
    return this.waitListItemEntityRepository.findOne({ where, ...options });
  }

  public async createItem(dto: IWaitListItemCreateDto, userEntity: UserEntity): Promise<WaitListItemEntity> {
    const { listId } = dto;
    const waitListListEntity = await this.waitListListService.findOne(
      { id: listId },
      { relations: { contract: true } },
    );

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const waitListItemEntity = await this.findOne(dto);

    if (waitListItemEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.create(dto);
  }

  public async create(dto: IWaitListItemCreateDto): Promise<WaitListItemEntity> {
    return this.waitListItemEntityRepository.create(dto).save();
  }

  public async delete(
    where: FindOptionsWhere<WaitListItemEntity>,
    userEntity: UserEntity,
  ): Promise<WaitListItemEntity> {
    const waitListItemEntity = await this.findOne(where, { relations: { list: { contract: true } } });

    if (!waitListItemEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (waitListItemEntity.list.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return waitListItemEntity.remove();
  }
}
