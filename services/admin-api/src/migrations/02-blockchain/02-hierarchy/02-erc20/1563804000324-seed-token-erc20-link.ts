import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenErc20LinkAt1563804000324 implements MigrationInterface {
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
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 102180101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 1021801},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 202180101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 2021801},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 302180101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 3021801},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 402180101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 4021801},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
