import {Injectable, NotFoundException, ForbiddenException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, Repository} from "typeorm";

import {MerchantStatus, UserRole} from "@trejgun/solo-types";

import {MerchantEntity} from "./merchant.entity";
import {IMerchantCreateDto, IMerchantSearchDto, IMerchantUpdateDto} from "./interfaces";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public search(dto: IMerchantSearchDto): Promise<[Array<MerchantEntity>, number]> {
    const {merchantStatus, query, skip, take} = dto;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

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

    if (merchantStatus && merchantStatus.length) {
      if (merchantStatus.length === 1) {
        queryBuilder.andWhere("merchant.merchantStatus = :merchantStatus", {merchantStatus: merchantStatus[0]});
      } else {
        queryBuilder.andWhere("merchant.merchantStatus IN(:...merchantStatus)", {merchantStatus});
      }
    }

    queryBuilder.leftJoinAndSelect("merchant.users", "user");

    queryBuilder.orderBy("merchant.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({
      where: {
        merchantStatus: MerchantStatus.ACTIVE,
      },
      select: ["id", "title"],
    });
  }

  public findAndCount(): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantEntityRepository.findAndCount();
  }

  public findOne(where: FindConditions<MerchantEntity>): Promise<MerchantEntity | undefined> {
    return this.merchantEntityRepository.findOne({where, relations: ["users"]});
  }

  public async update(
    where: FindConditions<MerchantEntity>,
    data: IMerchantUpdateDto,
    userEntity: UserEntity,
  ): Promise<MerchantEntity | undefined> {
    const {userIds, ...rest} = data;

    const merchantEntity = await this.merchantEntityRepository.findOne(where);

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    Object.assign(merchantEntity, rest);

    if (userEntity.userRoles.includes(UserRole.ADMIN)) {
      Object.assign(merchantEntity, {
        users: userIds.map(id => ({id})),
      });
    }

    return merchantEntity.save();
  }

  public async create(data: IMerchantCreateDto, userEntity: UserEntity): Promise<MerchantEntity> {
    const {userIds, ...rest} = data;

    return this.merchantEntityRepository
      .create({
        ...rest,
        merchantStatus: userEntity.userRoles.includes(UserRole.ADMIN) ? MerchantStatus.ACTIVE : MerchantStatus.PENDING,
        users: userEntity.userRoles.includes(UserRole.ADMIN) ? userIds.map(id => ({id})) : [userEntity],
      })
      .save();
  }

  public async delete(
    where: FindConditions<MerchantEntity>,
    userEntity: UserEntity,
  ): Promise<MerchantEntity | undefined> {
    const merchantEntity = await this.merchantEntityRepository.findOne(where);

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    const isAdmin = userEntity.userRoles.includes(UserRole.ADMIN);
    const isSelf = userEntity.userRoles.includes(UserRole.MERCHANT) && userEntity.merchantId === merchantEntity.id;

    if (!(isAdmin || isSelf)) {
      throw new ForbiddenException("insufficientPermissions");
    }

    Object.assign(merchantEntity, {merchantStatus: MerchantStatus.INACTIVE});

    return merchantEntity.save();
  }
}
