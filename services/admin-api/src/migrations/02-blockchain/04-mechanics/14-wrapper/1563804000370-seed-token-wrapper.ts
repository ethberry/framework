import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { NodeEnv, TokenMetadata } from "@framework/types";

export class SeedWrapperAt1563804000370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        113010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        113010101,
        'MINTED',
        1130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        113010102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        113010102,
        'MINTED',
        1130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        113010103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        113010103,
        'MINTED',
        1130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
