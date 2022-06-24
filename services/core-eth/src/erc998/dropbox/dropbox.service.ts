import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998DropboxEntity } from "./dropbox.entity";

@Injectable()
export class Erc998DropboxService {
  constructor(
    @InjectRepository(Erc998DropboxEntity)
    private readonly erc998DropboxEntityRepository: Repository<Erc998DropboxEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998DropboxEntity>,
    options?: FindOneOptions<Erc998DropboxEntity>,
  ): Promise<Erc998DropboxEntity | null> {
    return this.erc998DropboxEntityRepository.findOne({ where, ...options });
  }
}
