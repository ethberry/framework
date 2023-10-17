import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenErc20UsdtAt1563804000321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        ${process.env.NODE_ENV === NodeEnv.production ? 11 : 102150101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 11 : 1021501},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 12 : 202150101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 12 : 2021501},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 13 : 302150101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 13 : 3021501},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 14 : 402150101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 14 : 4021501},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
