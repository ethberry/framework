import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenErc20WETHAt1563804000322 implements MigrationInterface {
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
        ${process.env.NODE_ENV === NodeEnv.production ? 21 : 102160101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 21 : 1021601},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 22 : 202160101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 22 : 2021601},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 23 : 302160101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 23 : 3021601},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 24 : 402160101},
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        ${process.env.NODE_ENV === NodeEnv.production ? 24 : 4021601},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
