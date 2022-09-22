import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IWaitlistItemSearchDto } from "@framework/types";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistItemEntity } from "./item.entity";

@Injectable()
export class WaitlistItemService {
  constructor(
    @InjectRepository(WaitlistItemEntity)
    private readonly waitlistEntityRepository: Repository<WaitlistItemEntity>,
  ) {}

  public async search(dto: Partial<IWaitlistItemSearchDto>): Promise<[Array<WaitlistItemEntity>, number]> {
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
    where: FindOptionsWhere<WaitlistItemEntity>,
    options?: FindOneOptions<WaitlistItemEntity>,
  ): Promise<WaitlistItemEntity | null> {
    return this.waitlistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitlistItemCreateDto): Promise<WaitlistItemEntity> {
    const waitlistEntity = await this.findOne(dto);

    if (waitlistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.waitlistEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<WaitlistItemEntity>): Promise<DeleteResult> {
    return this.waitlistEntityRepository.delete(where);
  }
}
