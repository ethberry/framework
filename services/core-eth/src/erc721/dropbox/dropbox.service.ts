import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721DropboxEntity } from "./dropbox.entity";

@Injectable()
export class Erc721DropboxService {
  constructor(
    @InjectRepository(Erc721DropboxEntity)
    private readonly erc721DropboxEntityRepository: Repository<Erc721DropboxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721DropboxEntity>,
    options?: FindOneOptions<Erc721DropboxEntity>,
  ): Promise<Erc721DropboxEntity | null> {
    return this.erc721DropboxEntityRepository.findOne({ where, ...options });
  }
}
