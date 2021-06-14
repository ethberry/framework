import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindConditions, FindManyOptions, Repository} from "typeorm";

import {PromoEntity} from "./promo.entity";
import {IPromoCreateDto, IPromoSearchDto, IPromoUpdateDto} from "./interfaces";

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoEntity)
    private readonly promoEntityRepository: Repository<PromoEntity>,
  ) {}

  public findAndCount(
    where: FindConditions<PromoEntity>,
    options?: FindManyOptions<PromoEntity>,
  ): Promise<[Array<PromoEntity>, number]> {
    return this.promoEntityRepository.findAndCount({
      where,
      relations: ["product"],
      ...options,
    });
  }

  public async search({query}: IPromoSearchDto): Promise<[Array<PromoEntity>, number]> {
    if (query) {
      return this.promoEntityRepository
        .createQueryBuilder("promo")
        .select()
        .where("promo.title ILIKE '%' || :title || '%'", {title: query})
        .leftJoinAndSelect("promo.product", "product")
        .getManyAndCount();
    } else {
      return this.findAndCount({});
    }
  }

  public async update(where: FindConditions<PromoEntity>, data: IPromoUpdateDto): Promise<PromoEntity | undefined> {
    const promoEntity = await this.promoEntityRepository.findOne(where);

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    Object.assign(promoEntity, data);
    return promoEntity.save();
  }

  public create(data: IPromoCreateDto): Promise<PromoEntity> {
    return this.promoEntityRepository.create({...data}).save();
  }

  public async delete(where: FindConditions<PromoEntity>): Promise<void> {
    // TODO delete images
    await this.promoEntityRepository.delete(where);
  }
}
