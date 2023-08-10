import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenErc20USDTAt1563804000321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

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
        102150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1021501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        2021501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        302150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        3021501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        402150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        4021501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
