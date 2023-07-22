import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlErc998At20At1653616447240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR || wallet;
    const erc998ContractInactiveAddress = process.env.ERC998_INACTIVE_ADDR || wallet;
    const erc998ContractNewAddress = process.env.ERC998_NEW_ADDR || wallet;
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR || wallet;
    const erc998ContractDiscreteAddress = process.env.ERC998_DISCRETE_ADDR || wallet;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;
    const erc998ContractGenesAddress = process.env.ERC998_GENES_ADDR || wallet;
    const erc998ContractOwnerErc20Address = process.env.ERC998_OWNER_ERC20_ADDR || wallet;
    const erc998ContractOwnerErc1155Address = process.env.ERC998_OWNER_ERC1155_ADDR || wallet;
    const erc998ContractOwnerErc1155Erc20Address = process.env.ERC998_OWNER_ERC1155_ERC20_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc998ContractSimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractSimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractSimpleAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractInactiveAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractInactiveAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractInactiveAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractNewAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractNewAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractNewAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractBlacklistAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractBlacklistAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractBlacklistAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractDiscreteAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractDiscreteAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractDiscreteAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractGenesAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractGenesAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractGenesAddress}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc20Address}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc20Address}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc20Address}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Address}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Address}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Address}',
        '${wallet}',
        'METADATA_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
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
