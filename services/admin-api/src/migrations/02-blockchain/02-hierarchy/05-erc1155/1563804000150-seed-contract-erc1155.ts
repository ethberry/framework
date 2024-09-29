import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet, NodeEnv } from "@ethberry/constants";
import { baseTokenURI } from "@ethberry/contracts-constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc1155At1563804000150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC1155_SIMPLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC1155_INACTIVE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC1155_NEW_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC1155_BLACKLIST_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR;
    const erc1155ContractInactiveAddress = process.env.ERC1155_INACTIVE_ADDR;
    const erc1155ContractNewAddress = process.env.ERC1155_NEW_ADDR;
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR;
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        10501,
        '${erc1155ContractSimpleAddress}',
        '${chainId}',
        'Resources (simple)',
        '${simpleFormatting}',
        '${imagePath}/resources.png',
        '',
        '',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10502,
        '${erc1155ContractInactiveAddress}',
        '${chainId}',
        'ERC1155 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC1155',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10503,
        '${erc1155ContractNewAddress}',
        '${chainId}',
        'ERC1155 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC1155',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10504,
        '${erc1155ContractBlacklistAddress}',
        '${chainId}',
        'Potions (blacklist)',
        '${simpleFormatting}',
        '${imagePath}/potions.png',
        '',
        '',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        '{BLACKLIST}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10505,
        '${erc1155ContractInactiveAddress}',
        '${chainId}',
        'Candy (simple)',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        '{}',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20501,
        '${wallet}',
        56,
        'BEP',
        '${simpleFormatting}',
        '${imagePath}/binance.png',
        '',
        '',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
