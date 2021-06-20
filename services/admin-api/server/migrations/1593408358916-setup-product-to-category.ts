import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@trejgun/solo-constants-misc";

export class SetupProductToCategory1593408358916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.product_to_category (
        category_id,
        product_id
      ) VALUES (
        1,
        1
      ), (
        1,
        2
      ), (
        1,
        3
      ), (
        2,
        4
      ), (
        2,
        5
      ), (
        3,
        6
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product_to_category RESTART IDENTITY CASCADE;`);
  }
}
