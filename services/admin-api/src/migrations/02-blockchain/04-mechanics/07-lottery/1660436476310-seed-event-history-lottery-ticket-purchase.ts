import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";
import { subDays } from "date-fns";

import { wallets, NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryLotteryTicketPurchaseAt1660436476310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR;
    const erc721ContractLotteryAddress = process.env.ERC721_LOTTERY_TICKET_ADDR;

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
        102220010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLottery',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1230101",
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1230101",
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
          roundId: "1",
          numbers: "0x0000000000000000000000000000000000000000000000000000010203222324", // 1,2,3,34,35,36 !!!
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102220011,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "123010101",
        })}',
        102220010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102220012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102220010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102220020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLottery',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1230101",
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1230101",
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
          roundId: "2",
          numbers: "0x0000000000000000000000000000000000000000000000000000010203222324", // 1,2,3,34,35,36 !!!
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102220021,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "123010102",
        })}',
        102220020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102220022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102220020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102220030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLottery',
        '${JSON.stringify({
          account: wallets[0],
          externalId: "1230101",
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1230101",
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
          roundId: "3",
          numbers: "0x0000000000000000000000000000000000000000000000000000010203222324", // 1,2,3,34,35,36 !!!
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220031,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "123010103",
        })}',
        102220030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102220030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLottery',
        '${JSON.stringify({
          account: wallets[1],
          externalId: "1230101",
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1230101",
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
          roundId: "1",
          numbers: "0x0000000000000000000000000000000000000000000000000000010203222324", // 1,2,3,34,35,36 !!!
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220041,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "123010104",
        })}',
        102220040,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102220040,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseLottery',
        '${JSON.stringify({
          account: wallets[2],
          externalId: "1230101",
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1230101",
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
          roundId: "1",
          numbers: "0x0000000000000000000000000000000000000000000000000000010203222324", // 1,2,3,34,35,36 !!!
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220051,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "123010105",
        })}',
        102220050,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102220052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102220050,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
