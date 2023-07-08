import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;

    const now = new Date();
    const currentDateTime = now.toISOString();

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
        10301010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1030101",
          item: {
            tokenType: 2,
            token: erc721ContractSimpleAddress,
            tokenId: "1030101",
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
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010101",
        })}',
        10301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1030101",
          item: {
            tokenType: 2,
            token: erc721ContractSimpleAddress,
            tokenId: "1030101",
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
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010201",
        })}',
        10301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10301030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1030101",
          item: {
            tokenType: 2,
            token: erc721ContractSimpleAddress,
            tokenId: "1030101",
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
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10301031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103010301",
        })}',
        10301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10301032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
