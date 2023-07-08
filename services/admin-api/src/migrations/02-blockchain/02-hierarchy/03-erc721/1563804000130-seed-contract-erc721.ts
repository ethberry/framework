import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const erc721ContractInactiveAddress = process.env.ERC721_INACTIVE_ADDR || wallet;
    const erc721ContractNewAddress = process.env.ERC721_NEW_ADDR || wallet;
    const erc721ContractBlacklistAddress = process.env.ERC721_BLACKLIST_ADDR || wallet;
    const erc721ContractUpgradeableAddress = process.env.ERC721_UPGRADEABLE_ADDR || wallet;
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgems.png?alt=media&token=587bcbd2-80c6-4a0e-bb14-45e310d96a8a',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fjewelry.png?alt=media&token=13fe207d-b53c-40f7-ba2d-1551584dd30c',
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
        '${erc721ContractUpgradeableAddress}',
        '${chainId}',
        'Armour (lvl)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Farmour.png?alt=media&token=32650855-c62b-4ca0-b4f6-bfc01f40e53e',
        'ARMOUR',
        'LVL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{UPGRADEABLE}',
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
        '${imageUrl}',
        'WEAPON',
        'RNG721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{UPGRADEABLE,RANDOM}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10307,
        '${erc721ContractGenesAddress}',
        '${chainId}',
        'DNA (traits)',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fawards.png?alt=media&token=da1828cc-7345-4286-9d41-fad67db73b3b',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Ftransport.png?alt=media&token=bd58c0ac-3318-460c-9e11-c66dd4f68e34',
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
        '${erc721ContractUpgradeableAddress}',
        '${chainId}',
        'Under Armour (lvl)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Farmour.png?alt=media&token=32650855-c62b-4ca0-b4f6-bfc01f40e53e',
        'UA',
        'UA721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{UPGRADEABLE}',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
