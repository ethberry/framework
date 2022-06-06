import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractManager1652962207610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR || wallet;
    const erc721MarketplaceAddr = process.env.ERC721_MARKETPLACE_ADDR || wallet;
    const erc721AirdropAddr = process.env.ERC721_AIRDROP_ADDR || wallet;
    const erc721DropboxAddr = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CraftAddr = process.env.ERC721_CRAFT_ADDR || wallet;
    const erc1155Marketplace = process.env.ERC1155_MARKETPLACE_ADDR || wallet;
    const erc1155CraftAddr = process.env.ERC1155_CRAFT_ADDR || wallet;

    const lastBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract_manager (
        address,
        contract_type,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        '${contractManagerAddress}',
        'CONTRACT_MANAGER',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
       '${erc721MarketplaceAddr}',
        'ERC721_MARKETPLACE',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721AirdropAddr}',
        'ERC721_AIRDROP',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
       '${erc721DropboxAddr}',
        'ERC721_DROPBOX',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721CraftAddr}',
        'ERC721_CRAFT',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
       '${erc1155Marketplace}',
        'ERC1155_MARKETPLACE',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155CraftAddr}',
        'ERC1155_CRAFT',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
       );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract_manager RESTART IDENTITY CASCADE;`);
  }
}
