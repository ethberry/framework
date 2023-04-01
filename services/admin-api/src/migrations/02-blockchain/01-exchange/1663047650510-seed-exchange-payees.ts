import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedExchangePayees1663047650510 implements MigrationInterface {
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
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        '${wallets[1]}',
        10,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        '${wallets[2]}',
        5,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.payees RESTART IDENTITY CASCADE;`);
  }
}
