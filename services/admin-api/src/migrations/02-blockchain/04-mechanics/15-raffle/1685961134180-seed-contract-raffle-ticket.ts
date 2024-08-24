import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { baseTokenURI } from "@gemunion/contracts-constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractRaffleTicketAt1685961134180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC721_RAFFLE_TICKET_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc721ContractRaffleAddress = process.env.ERC721_RAFFLE_TICKET_ADDR;
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
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        12101,
        '${erc721ContractRaffleAddress}',
        '${chainId}',
        'RAFFLE TICKET',
        '${simpleFormatting}',
        '${imageUrl}',
        'RAFF',
        'RAFF721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{}',
        'RAFFLE',
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
