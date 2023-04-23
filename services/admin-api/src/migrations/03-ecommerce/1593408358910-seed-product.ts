import { MigrationInterface, QueryRunner } from "typeorm";

import { rawStateString } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedProducts1593408358910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.product (
        title,
        description,
        price_id,
        amount,
        product_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'Bottle of water',
        '${rawStateString}',
        190101,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Jar of water',
        '${rawStateString}',
        190102,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Barrel of water',
        '${rawStateString}',
        190103,
        10,
        'INACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        190104,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        190105,
        10,
        'INACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        190106,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product RESTART IDENTITY CASCADE;`);
  }
}
