import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedWrapperAt1563804000370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        17010101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "170101",
        })}',
        100,
        17010101,
        'MINTED',
        170101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        17010102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "170101",
        })}',
        100,
        17010102,
        'MINTED',
        170101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        17010103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "170101",
        })}',
        100,
        17010103,
        'MINTED',
        170101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
