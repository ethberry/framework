import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
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
        parameters,
        price_id,
        amount,
        product_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'Bottle of water',
        '${simpleFormatting}',
        '${JSON.stringify([])}',
        190101,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Jar of water',
        '${simpleFormatting}',
        '${JSON.stringify([])}',
        190102,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Barrel of water',
        '${simpleFormatting}',
        '${JSON.stringify([])}',
        190103,
        10,
        'INACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${simpleFormatting}',
        '${JSON.stringify([
          {
            parameterName: "SIZE",
            parameterType: "string",
            parameterValue: "M",
          },
          {
            parameterName: "COLOR",
            parameterType: "string",
            parameterValue: "BLUE",
          },
        ])}',
        190104,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${simpleFormatting}',
        '${JSON.stringify([
          {
            parameterName: "SIZE",
            parameterType: "string",
            parameterValue: "M",
          },
          {
            parameterName: "COLOR",
            parameterType: "string",
            parameterValue: "RED",
          },
        ])}',
        190105,
        10,
        'INACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'T-Shirt',
        '${simpleFormatting}',
        '${JSON.stringify([
          {
            parameterName: "SIZE",
            parameterType: "string",
            parameterValue: "XL",
          },
          {
            parameterName: "COLOR",
            parameterType: "string",
            parameterValue: "RED",
          },
        ])}',
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
