import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet, NodeEnv } from "@ethberry/constants";
import { baseTokenURI } from "@ethberry/contracts-constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc998At1563804000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC998_SIMPLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_INACTIVE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_NEW_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_BLACKLIST_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_DISCRETE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_RANDOM_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_GENES_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_RENTABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_OWNER_ERC20_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_OWNER_ERC1155_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC998_OWNER_ERC1155_ERC20_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR;
    const erc998ContractInactiveAddress = process.env.ERC998_INACTIVE_ADDR;
    const erc998ContractNewAddress = process.env.ERC998_NEW_ADDR;
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR;
    const erc998ContractDiscreteAddress = process.env.ERC998_DISCRETE_ADDR;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR;
    const erc998ContractGenesAddress = process.env.ERC998_GENES_ADDR;
    const erc998ContractRentableAddress = process.env.ERC998_RENTABLE_ADDR;
    const erc998ContractOwnerErc20Address = process.env.ERC998_OWNER_ERC20_ADDR;
    const erc998ContractOwnerErc1155Address = process.env.ERC998_OWNER_ERC1155_ADDR;
    const erc998ContractOwnerErc1155Erc20Address = process.env.ERC998_OWNER_ERC1155_ERC20_ADDR;
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
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
        '${imagePath}/runes.png',
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
        '${imagePath}/scrolls.png',
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
        '${imagePath}/spell_books.png',
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
        '${imagePath}/heroes.png',
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
        '${imagePath}/buildings.png',
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
        '${imagePath}/heroes.png',
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
        '${imagePath}/binance.png',
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
