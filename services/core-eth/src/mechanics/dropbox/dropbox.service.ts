import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { DropboxEntity } from "./dropbox.entity";

@Injectable()
export class DropboxService {
  constructor(
    @InjectRepository(DropboxEntity)
    private readonly dropboxEntityRepository: Repository<DropboxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<DropboxEntity>,
    options?: FindOneOptions<DropboxEntity>,
  ): Promise<DropboxEntity | null> {
    return this.dropboxEntityRepository.findOne({ where, ...options });
  }
}
