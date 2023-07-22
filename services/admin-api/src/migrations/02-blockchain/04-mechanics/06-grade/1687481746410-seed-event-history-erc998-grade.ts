import { MigrationInterface, QueryRunner } from "typeorm";
import { toUtf8Bytes, WeiPerEther, ZeroHash, zeroPadValue } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc998GradeAt1687481746410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc998ContractDiscreteAddress = process.env.ERC998_DISCRETE_ADDR || wallet;
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
        10406010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10401,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc998ContractDiscreteAddress,
            tokenId: "104050101",
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
        10406011,
        '${erc998ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "104050101",
          attribute: LEVEL,
          value: "10",
        })}',
        10406010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10406010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10402,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc998ContractDiscreteAddress,
            tokenId: "104050201",
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
        10406021,
        '${erc998ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "104050201",
          attribute: LEVEL,
          value: "10",
        })}',
        10406020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10406020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Upgrade',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 10408,
          attribute: LEVEL,
          items: {
            tokenType: 2,
            token: erc998ContractDiscreteAddress,
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
        10406031,
        '${erc998ContractDiscreteAddress}',
        '${ZeroHash}',
        'LevelUp',
        '${JSON.stringify({
          account: wallets[0],
          tokenId: "103800101",
          attribute: LEVEL,
          value: "8",
        })}',
        10406030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10406030,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
