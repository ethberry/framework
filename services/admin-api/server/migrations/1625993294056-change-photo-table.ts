import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@trejgun/solo-constants-misc";

export class ChangePhotoTable1625993294056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.photo add column priority int default 0 not null;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.photo drop column priority;`);
  }
}
