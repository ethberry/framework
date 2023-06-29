import { MigrationInterface, QueryRunner } from "typeorm";

import { rawStateString } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedProduct1683724061410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.product (
        title,
        description,
        merchant_id,
        height,
        width,
        length,
        weight,
        product_status,
        created_at,
        updated_at
      ) VALUES (
        'Bottle of water',
        '${rawStateString}',
        1,
        280,
        80,
        80,
        500,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Jar of water',
        '${rawStateString}',
        1,
        320,
        120,
        120,
        1500,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Barrel of water',
        '${rawStateString}',
        1,
        450,
        220,
        220,
        2500,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        2,
        60,
        560,
        210,
        300,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        2,
        60,
        560,
        210,
        300,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${rawStateString}',
        2,
        60,
        560,
        210,
        300,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product RESTART IDENTITY CASCADE;`);
  }
}
