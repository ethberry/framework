import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, ZeroAddress } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721ClaimAt1563804040330 implements MigrationInterface {
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
        1302010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1030201",
          items: [[2, erc721ContractSimpleAddress, "1030101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        1302010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1030202",
          items: [[2, erc721ContractSimpleAddress, "1030101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010201",
        })}',
        1302020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1030203",
          items: [[2, erc721ContractSimpleAddress, "1030101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010301",
        })}',
        1302030,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
