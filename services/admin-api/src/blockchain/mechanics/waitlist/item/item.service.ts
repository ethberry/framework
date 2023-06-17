import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IWaitListItemSearchDto } from "@framework/types";

import { IWaitListItemCreateDto } from "./interfaces";
import { WaitListItemEntity } from "./item.entity";

@Injectable()
export class WaitListItemService {
  constructor(
    @InjectRepository(WaitListItemEntity)
    private readonly waitlistEntityRepository: Repository<WaitListItemEntity>,
  ) {}

  public async search(dto: Partial<IWaitListItemSearchDto>): Promise<[Array<WaitListItemEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.waitlistEntityRepository.createQueryBuilder("waitlist");

    queryBuilder.select();

    queryBuilder.leftJoin("waitlist.list", "list");
    queryBuilder.addSelect(["list.title"]);

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
    return this.waitlistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitListItemCreateDto): Promise<WaitListItemEntity> {
    const waitlistEntity = await this.findOne(dto);

    if (waitlistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitlistEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<WaitListItemEntity>): Promise<DeleteResult> {
    return this.waitlistEntityRepository.delete(where);
  }
}
