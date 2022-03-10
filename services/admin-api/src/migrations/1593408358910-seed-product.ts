import { MigrationInterface, QueryRunner } from "typeorm";

import { rawStateString } from "@gemunion/draft-js-utils";
import { ns } from "@gemunion/framework-constants";

export class SeedProducts1593408358910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.product (
        title,
        description,
        price,
        amount,
        product_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'Bottle of water',
        '${rawStateString}',
        100,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Jar of water',
        '${rawStateString}',
        1000,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Barrel of water',
        '${rawStateString}',
        10000,
        10,
        'INACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Milk',
        '${rawStateString}',
        10000,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Beer',
        '${rawStateString}',
        10000,
        10,
        'INACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Juice',
        '${rawStateString}',
        10000,
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
