import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet, NodeEnv } from "@ethberry/constants";
import { baseTokenURI } from "@ethberry/contracts-constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC721_SIMPLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_INACTIVE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_NEW_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_BLACKLIST_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_DISCRETE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_RANDOM_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_SOULBOUND_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_GENES_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_RENTABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR;
    const erc721ContractInactiveAddress = process.env.ERC721_INACTIVE_ADDR;
    const erc721ContractNewAddress = process.env.ERC721_NEW_ADDR;
    const erc721ContractBlacklistAddress = process.env.ERC721_BLACKLIST_ADDR;
    const erc721ContractDiscreteAddress = process.env.ERC721_DISCRETE_ADDR;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR;
    const erc721ContractSoulboundAddress = process.env.ERC721_SOULBOUND_ADDR;
    const erc721ContractGenesAddress = process.env.ERC721_GENES_ADDR;
    const erc721ContractRentableAddress = process.env.ERC721_RENTABLE_ADDR;
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
        10301,
        '${erc721ContractSimpleAddress}',
        '${chainId}',
        'Gems (simple)',
        '${simpleFormatting}',
        '${imagePath}/gems.png',
        'GEMS',
        'GEMS721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302,
        '${erc721ContractInactiveAddress}',
        '${chainId}',
        'ERC721 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC721 INACTIVE',
        'OFF721',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC721',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10303,
        '${erc721ContractNewAddress}',
        '${chainId}',
        'ERC721 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC721 NEW',
        'NEW721',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC721',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10304,
        '${erc721ContractBlacklistAddress}',
        '${chainId}',
        'Jewelry (blacklist)',
        '${simpleFormatting}',
        '${imagePath}/jewelry.png',
        'ERC721 BLACKLIST',
        'BL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10305,
        '${erc721ContractDiscreteAddress}',
        '${chainId}',
        'Armour (lvl)',
        '${simpleFormatting}',
        '${imagePath}/armour.png',
        'ARMOUR',
        'LVL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{DISCRETE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306,
        '${erc721ContractRandomAddress}',
        '${chainId}',
        'Weapon (random)',
        '${simpleFormatting}',
        '${imagePath}/weapon.png',
        'WEAPON',
        'RNG721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{DISCRETE,RANDOM}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10307,
        '${erc721ContractGenesAddress}',
        '${chainId}',
        'DNA (genes)',
        '${simpleFormatting}',
        '${imageUrl}',
        'GENES',
        'DNA721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{GENES}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10308,
        '${erc721ContractSoulboundAddress}',
        '${chainId}',
        'Awards (soulbound)',
        '${simpleFormatting}',
        '${imagePath}/awards.png',
        'SOULBOUND',
        'SB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{SOULBOUND}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10309,
        '${erc721ContractRentableAddress}',
        '${chainId}',
        'Transport (rentable)',
        '${simpleFormatting}',
        '${imagePath}/transport.png',
        'RENTABLE',
        'REN721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{RENTABLE}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10380,
        '${erc721ContractDiscreteAddress}',
        '${chainId}',
        'Under Armour (lvl)',
        '${simpleFormatting}',
        '${imagePath}/transport.png',
        'UA',
        'UA721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{DISCRETE}',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20301,
        '${wallet}',
        56,
        'BEP',
        '${simpleFormatting}',
        '${imagePath}/binance.png',
        'BEP',
        'BEP721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
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
