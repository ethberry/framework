import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlErc1155At20At1653616447250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;
    const erc1155ContractInactiveAddress = process.env.ERC1155_INACTIVE_ADDR || wallet;
    const erc1155ContractNewAddress = process.env.ERC1155_NEW_ADDR || wallet;
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc1155ContractSimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractSimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractInactiveAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractInactiveAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractNewAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractNewAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractBlacklistAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractBlacklistAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
