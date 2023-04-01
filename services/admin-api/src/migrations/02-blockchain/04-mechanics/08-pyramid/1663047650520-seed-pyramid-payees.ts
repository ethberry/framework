import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedPyramidPayees1663047650520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {

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
