import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlMysteryAt1663804100790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractMysterySimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR;
    const erc721ContractMysteryPausableAddress = process.env.ERC721_MYSTERYBOX_PAUSABLE_ADDR;
    const erc721ContractMysteryBlacklistAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_ADDR;
    const erc721ContractMysteryBlacklistPausableAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc721ContractMysterySimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysterySimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysterySimpleAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysterySimpleAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryPausableAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryPausableAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryPausableAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryPausableAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractMysteryBlacklistPausableAddress}',
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
