import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, Repository} from "typeorm";

import {MerchantStatus} from "@gemunionstudio/framework-types";

import {MerchantEntity} from "./merchant.entity";
import {IMerchantSearchDto} from "./interfaces";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public async autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({
      where: {
        merchantStatus: MerchantStatus.ACTIVE,
      },
      select: ["id", "title"],
    });
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
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(merchant.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("merchant.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", {description: query});
        }),
      );
    }

    return queryBuilder.getManyAndCount();
  }
}
