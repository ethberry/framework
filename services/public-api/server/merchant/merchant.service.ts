import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, FindManyOptions, Repository} from "typeorm";

import {MerchantStatus} from "@trejgun/solo-types";

import {MerchantEntity} from "./merchant.entity";
import {IMerchantSearchDto} from "./interfaces";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public findAndCount(
    where: FindConditions<MerchantEntity>,
    options?: FindManyOptions<MerchantEntity>,
  ): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantEntityRepository.findAndCount({where, ...options});
  }

  public findOne(where: FindConditions<MerchantEntity>): Promise<MerchantEntity | undefined> {
    return this.merchantEntityRepository.findOne({where});
  }

  public async search(search: IMerchantSearchDto): Promise<[Array<MerchantEntity>, number]> {
    const {query} = search;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

    queryBuilder.where({merchantStatus: MerchantStatus.ACTIVE});

    // TODO where count(products) > 0

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("merchant.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("merchant.description ILIKE '%' || :description || '%'", {description: query});
        }),
      );
    }

    return queryBuilder.getManyAndCount();
  }
}
