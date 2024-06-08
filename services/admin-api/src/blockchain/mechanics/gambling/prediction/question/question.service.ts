import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPredictionQuestionSearchDto } from "@framework/types";

import { PredictionQuestionEntity } from "./question.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { DiscreteEntity } from "../../../gaming/discrete/discrete.entity";
import { AssetService } from "../../../../exchange/asset/asset.service";
import type { IPredictionQuestionCreateDto, IPredictionQuestionUpdateDto } from "./interfaces";

@Injectable()
export class PredictionQuestionService {
  constructor(
    @InjectRepository(PredictionQuestionEntity)
    private readonly predictionQuestionEntityRepository: Repository<PredictionQuestionEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: Partial<IPredictionQuestionSearchDto>): Promise<[Array<PredictionQuestionEntity>, number]> {
    const { skip, take, query, questionStatus } = dto;

    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(question.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("question.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (questionStatus) {
      if (questionStatus.length === 1) {
        queryBuilder.andWhere("question.questionStatus = :questionStatus", { productStatus: questionStatus[0] });
      } else {
        queryBuilder.andWhere("question.questionStatus IN(:...questionStatus)", { questionStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("question.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<PredictionQuestionEntity>,
    options?: FindOneOptions<PredictionQuestionEntity>,
  ): Promise<PredictionQuestionEntity | null> {
    return this.predictionQuestionEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(
    where: FindOptionsWhere<PredictionQuestionEntity>,
  ): Promise<PredictionQuestionEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "question",
        leftJoinAndSelect: {
          price: "question.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }

  public async autocomplete(): Promise<Array<PredictionQuestionEntity>> {
    const queryBuilder = this.predictionQuestionEntityRepository.createQueryBuilder("question");

    queryBuilder.select(["id", "title"]);

    queryBuilder.orderBy({
      "question.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public async create(dto: IPredictionQuestionCreateDto, userEntity: UserEntity): Promise<PredictionQuestionEntity> {
    const { price, ...rest } = dto;

    const assetEntity = await this.assetService.create();
    await this.assetService.update(assetEntity, price, userEntity);

    return this.predictionQuestionEntityRepository
      .create({
        ...rest,
        price: assetEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<DiscreteEntity>,
    dto: Partial<IPredictionQuestionUpdateDto>,
    userEntity: UserEntity,
  ): Promise<PredictionQuestionEntity> {
    const { price, ...rest } = dto;

    const questionEntity = await this.findOne(where, {
      relations: {
        price: {
          components: true,
        },
      },
    });

    if (!questionEntity) {
      throw new NotFoundException("questionNotFound");
    }

    if (questionEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (price) {
      await this.assetService.update(questionEntity.price, price, userEntity);
    }

    Object.assign(questionEntity, rest);
    return questionEntity.save();
  }

  public async delete(where: FindOptionsWhere<PredictionQuestionEntity>): Promise<void> {
    await this.predictionQuestionEntityRepository.delete(where);
  }
}
