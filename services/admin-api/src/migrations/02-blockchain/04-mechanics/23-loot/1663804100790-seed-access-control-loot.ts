import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedAccessControlLootAt1663804100790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractLootSimpleAddress = process.env.ERC721_LOOTBOX_SIMPLE_ADDR;
    const erc721ContractLootPausableAddress = process.env.ERC721_LOOTBOX_PAUSABLE_ADDR;
    const erc721ContractLootBlacklistAddress = process.env.ERC721_LOOTBOX_BLACKLIST_ADDR;
    const erc721ContractLootBlacklistPausableAddress = process.env.ERC721_LOOTBOX_BLACKLIST_PAUSABLE_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc721ContractLootSimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootSimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootSimpleAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootSimpleAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootPausableAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootPausableAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootPausableAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootPausableAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistPausableAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistPausableAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistPausableAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractLootBlacklistPausableAddress}',
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
