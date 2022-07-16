import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository, FindOptionsWhere, FindOneOptions } from "typeorm";

import { AssetEntity } from "./asset.entity";
import { IAssetDto } from "./interfaces";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenType } from "@framework/types";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto): Promise<AssetEntity> {
    // TODO transactions?
    console.log("asset", asset);
    console.log("dto", dto);
    // patch NATIVE and ERC20 tokens
    for (const component of dto.components) {
      if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
        const templateEntity = await this.templateService.findOne(
          { contractId: component.contractId },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }
        component.tokenId = templateEntity.tokens[0].id;
      } else if (component.tokenType === TokenType.ERC721 || component.tokenType === TokenType.ERC998) {
        const templateEntity = await this.templateService.findOne(
          { id: component.tokenId },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }
        console.log("templateEntity", templateEntity);
        component.tokenId = templateEntity.id;
      } else if (component.tokenType === TokenType.ERC1155) {
        const templateEntity = await this.templateService.findOne(
          { id: component.tokenId },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }
        component.tokenId = templateEntity.tokens[0].id;
      }
    }

    if (dto.components.length) {
      // remove old
      await Promise.allSettled(
        asset.components
          .filter(oldItem => !dto.components.find(newItem => newItem.id === oldItem.id))
          .map(oldItem => oldItem.remove()),
      );

      // change existing
      const changedComponents = await Promise.allSettled(
        asset.components
          .filter(oldItem => dto.components.find(newItem => newItem.id === oldItem.id))
          .map(oldItem => {
            Object.assign(
              oldItem,
              dto.components.find(newItem => newItem.id === oldItem.id),
            );
            return oldItem.save();
          }),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
          .map(c => c.value),
      );

      // add new
      const newComponents = await Promise.allSettled(
        dto.components
          .filter(newItem => !newItem.id)
          .map(newItem => this.assetComponentEntityRepository.create({ ...newItem, assetId: asset.id }).save()),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
          .map(c => c.value),
      );

      Object.assign(asset, { components: [...changedComponents, ...newComponents] });
    }

    return asset.save();
  }

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }
}
