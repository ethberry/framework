import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlCollectionAt1679894502230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractGenerativeAddress = process.env.ERC721_GENERATIVE_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc721ContractGenerativeAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractGenerativeAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractGenerativeAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
