import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721ClaimAt1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
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
        10302010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractSimpleAddress,
              tokenId: "1030101",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        10302010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302021,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        10302020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractSimpleAddress,
              tokenId: "1030101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        10302030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302032,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        10302030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Claim',
        '${JSON.stringify({
          account: wallets[1],
          externalId: 3,
          items: [
            {
              tokenType: 2,
              token: erc721ContractSimpleAddress,
              tokenId: "1030101",
              amount: "1",
            },
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302041,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "103010101",
        })}',
        10302040,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302042,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "103060101",
        })}',
        10302040,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
