import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractErc998At1563804000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
    const erc998ContractRentableAddress = process.env.ERC998_RENTABLE_ADDR || wallet;
    const erc998ContractOwnerErc20Address = process.env.ERC998_OWNER_ERC20_ADDR || wallet;
    const erc998ContractOwnerErc1155Address = process.env.ERC998_OWNER_ERC1155_ADDR || wallet;
    const erc998ContractOwnerErc1155Erc20Address = process.env.ERC998_OWNER_ERC1155_ERC20_ADDR || wallet;
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
        10401,
        '${erc998ContractSimpleAddress}',
        '${chainId}',
        'Runes (simple)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frunes.png?alt=media&token=aaabff2e-b8d1-493f-a81e-38456959e6b4',
        'RUNE',
        'RUNE998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10402,
        '${erc998ContractInactiveAddress}',
        '${chainId}',
        'ERC998 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 INACTIVE',
        'OFF998',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10403,
        '${erc998ContractNewAddress}',
        '${chainId}',
        'ERC998 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 NEW',
        'NEW998',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10404,
        '${erc998ContractBlacklistAddress}',
        '${chainId}',
        'Scrolls (blacklist)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls.png?alt=media&token=4771aaf1-0de2-441d-9d4e-06ab8dcafb6f',
        'ERC998 BLACKLIST',
        'BL998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,BLACKLIST}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10405,
        '${erc998ContractDiscreteAddress}',
        '${chainId}',
        'Spell books (discrete)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspell_books.png?alt=media&token=72784284-77e2-45d5-9b73-d44e202ee4a6',
        'ERC998 DISCRETE',
        'LVL998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,DISCRETE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406,
        '${erc998ContractRandomAddress}',
        '${chainId}',
        'Heroes (random)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fheroes.png?alt=media&token=899da038-3709-4665-9e2b-9b7154e9adfa',
        'ERC998 RANDOM',
        'RNG998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,DISCRETE,RANDOM}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10407,
        '${erc998ContractGenesAddress}',
        '${chainId}',
        'AXIE (genes)',
        '${simpleFormatting}',
        '${imageUrl}',
        'GENES',
        'DNA998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,GENES}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10409,
        '${erc998ContractRentableAddress}',
        '${chainId}',
        'Buildings (rentable)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings.png?alt=media&token=762c8248-b947-4ddf-9df3-e4278c95ba77',
        'RENTABLE',
        'REN998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,RENTABLE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10411,
        '${erc998ContractOwnerErc20Address}',
        '${chainId}',
        'ERC998 (ERC20 OWNER)',
        '${simpleFormatting}',
        '${imageUrl}',
        'OWNER ERC20',
        'OWN20',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,ERC20OWNER}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10412,
        '${erc998ContractOwnerErc1155Address}',
        '${chainId}',
        'ERC998 (ERC1155 OWNER)',
        '${simpleFormatting}',
        '${imageUrl}',
        'OWNER ERC1155',
        'OWN1155',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,ERC1155OWNER}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10413,
        '${erc998ContractOwnerErc1155Erc20Address}',
        '${chainId}',
        'ERC998 (ERC20+ERC1155 OWNER)',
        '${simpleFormatting}',
        '${imageUrl}',
        'OWNER FULL',
        'OWNFULL',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,ERC20OWNER,ERC1155OWNER}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10480,
        '${erc998ContractDiscreteAddress}',
        '${chainId}',
        'Anti-Heros (lvl)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fheroes.png?alt=media&token=899da038-3709-4665-9e2b-9b7154e9adfa',
        'AH',
        'AH998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{DISCRETE}',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401,
        '${wallet}',
        56,
        'BEP',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
        'BEP',
        'BEP998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE}',
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
