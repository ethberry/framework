import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc1155At1563804000150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;
    const erc1155ContractInactiveAddress = process.env.ERC1155_INACTIVE_ADDR || wallet;
    const erc1155ContractNewAddress = process.env.ERC1155_NEW_ADDR || wallet;
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || testChainId;
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
        1501,
        '${erc1155ContractSimpleAddress}',
        '${chainId}',
        'Resources (simple)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fresources.png?alt=media&token=8e3c28ae-b0fc-4eef-ac23-1ebc9fe92bc3',
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
        1502,
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
        1503,
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
        1504,
        '${erc1155ContractBlacklistAddress}',
        '${chainId}',
        'Potions (blacklist)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpotions.png?alt=media&token=e736b4fd-0eb1-4bff-b867-4f26601a5ea8',
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
        2501,
        '${wallet}',
        56,
        'BEP',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
