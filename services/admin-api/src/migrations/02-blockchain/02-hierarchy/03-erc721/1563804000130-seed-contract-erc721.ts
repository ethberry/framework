import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
    const erc721ContractRentableAddress = process.env.ERC721_RENTABLE_ADDR || wallet;
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
        10301,
        '${erc721ContractSimpleAddress}',
        '${chainId}',
        'Gems (simple)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fgems.png?alt=media&token=ce8c4ae7-c3df-407d-976b-805a3bb4e819',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fjewelry.png?alt=media&token=1b64ed02-de2b-4474-b7fc-e1d9e0352dd8',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Farmour.png?alt=media&token=cd830dc3-8e98-4315-8b93-7f13e8f9dcf3',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fweapon.png?alt=media&token=42d72749-ba72-4d0d-b412-df3d08ee7783',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fawards.png?alt=media&token=5e913abf-f903-4d7e-ad13-5a2a27356de0',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Ftransport.png?alt=media&token=2270c175-37d9-40dc-a14d-bfa57c402b1e',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Ftransport.png?alt=media&token=2270c175-37d9-40dc-a14d-bfa57c402b1e',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
