import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@gemunionstudio/framework-constants-misc";

export class RenameFieldsInTokenTable1609914289830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.token rename column token to uuid;`);
    await queryRunner.query(`alter table ${ns}.token rename column type to token_type;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.token rename column uuid to token;`);
    await queryRunner.query(`alter table ${ns}.token rename column token_type to type;`);
  }
}
