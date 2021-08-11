import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@gemunionstudio/solo-constants-misc";

export class AddDefaultsToUserTable1613540646714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN phone_number SET DEFAULT '';`);
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN image_url SET DEFAULT '';`);
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN comment SET DEFAULT '';`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN phone_number DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN image_url DROP DEFAULT;`);
    await queryRunner.query(`ALTER TABLE ${ns}.user ALTER COLUMN comment DROP DEFAULT;`);
  }
}
