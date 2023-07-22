import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlErc721At20At1653616447230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const erc721ContractInactiveAddress = process.env.ERC721_INACTIVE_ADDR || wallet;
    const erc721ContractNewAddress = process.env.ERC721_NEW_ADDR || wallet;
    const erc721ContractBlacklistAddress = process.env.ERC721_BLACKLIST_ADDR || wallet;
    const erc721ContractDiscreteAddress = process.env.ERC721_DISCRETE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const erc721ContractSoulboundAddress = process.env.ERC721_SOULBOUND_ADDR || wallet;
    const erc721ContractGenesAddress = process.env.ERC721_GENES_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc721ContractSimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractSimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractSimpleAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractInactiveAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractInactiveAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractInactiveAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractNewAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractNewAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractNewAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractBlacklistAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractBlacklistAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractBlacklistAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractDiscreteAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractDiscreteAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractDiscreteAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractRandomAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractRandomAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractRandomAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractSoulboundAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractSoulboundAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractSoulboundAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractGenesAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractGenesAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractGenesAddress}',
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
