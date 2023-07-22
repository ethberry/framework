import { MigrationInterface, QueryRunner } from "typeorm";
import { toUtf8Bytes, WeiPerEther, ZeroHash, zeroPadValue } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721GradeAt1687481746310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractDiscreteAddress = process.env.ERC721_DISCRETE_ADDR || wallet;
    const currentDateTime = new Date().toISOString();
    const LEVEL = zeroPadValue(toUtf8Bytes("LEVEL"), 32);

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
        10306010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10301,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc721ContractDiscreteAddress,
            tokenId: "103050101",
            amount: "1",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306011,
        '${erc721ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "103050101",
          attribute: LEVEL,
          value: "10",
        })}',
        10306010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10306010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10302,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc721ContractDiscreteAddress,
            tokenId: "103050201",
            amount: "1",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306021,
        '${erc721ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "103050201",
          attribute: LEVEL,
          value: "10",
        })}',
        10306020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10306020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10308,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc721ContractDiscreteAddress,
            tokenId: "103800101",
            amount: "1",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "102800101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306031,
        '${erc721ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "103800101",
          attribute: LEVEL,
          value: "8",
        })}',
        10306030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10306032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10306030,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
