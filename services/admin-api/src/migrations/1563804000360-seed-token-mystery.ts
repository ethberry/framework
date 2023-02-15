import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenMysteryAt1563804000360 implements MigrationInterface {
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
        16010101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "160101",
        })}',
        100,
        '1',
        'MINTED',
        160101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        16040101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "160401",
        })}',
        100,
        '1',
        'MINTED',
        160401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        16050101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "160501",
        })}',
        100,
        '1',
        'MINTED',
        160501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        16060101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "160601",
        })}',
        100,
        '1',
        'MINTED',
        160601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
