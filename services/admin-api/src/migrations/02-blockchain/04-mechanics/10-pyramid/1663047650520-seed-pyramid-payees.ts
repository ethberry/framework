import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedPyramidPayees1663047650520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.payees (
        account,
        shares,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        85,
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        '${wallets[1]}',
        10,
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        '${wallets[2]}',
        5,
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.payees RESTART IDENTITY CASCADE;`);
  }
}
