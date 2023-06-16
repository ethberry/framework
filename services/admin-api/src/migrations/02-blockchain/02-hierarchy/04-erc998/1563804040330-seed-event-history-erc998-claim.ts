import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, ZeroAddress } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc998ClaimAt1563804040330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        1304010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130401",
          items: [[2, erc721ContractSimpleAddress, "140101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1304011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010101",
        })}',
        1304010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1304020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130402",
          items: [[2, erc721ContractSimpleAddress, "140101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1304021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010201",
        })}',
        1304020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1304030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130403",
          items: [[2, erc721ContractSimpleAddress, "140101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1304031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010301",
        })}',
        1304030,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
