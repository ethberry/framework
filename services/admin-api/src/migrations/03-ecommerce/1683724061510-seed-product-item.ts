import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedProductItem1683724061510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        190101
      ), (
        190102
      ), (
        190103
      ), (
        190104
      ), (
        190105
      ), (
        190106
      ), (
        190107
      ), (
        190108
      ), (
        190109
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.product_item (
        id,
        product_id,
        price_id,
        min_quantity,
        max_quantity,
        sku,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        190101,
        11,
        500,
        '1',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        2,
        190102,
        11,
        1000,
        '2',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        3,
        190103,
        11,
        5000,
        '3',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        4,
        190104,
        1,
        null,
        '4',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        5,
        190105,
        2,
        null,
        '5',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        6,
        190106,
        3,
        null,
        '6',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        4,
        190107,
        5,
        null,
        '7',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        8,
        5,
        190108,
        6,
        null,
        '8',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        9,
        6,
        190109,
        7,
        null,
        '9',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product_item RESTART IDENTITY CASCADE;`);
  }
}
