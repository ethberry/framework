import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther, ZeroAddress } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryRaffleTicketPurchaseAt1685961136310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractLotteryAddress = process.env.ERC721_LOTTERY_TICKET_ADDR || wallet;

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
        102210010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseRaffle',
        '${JSON.stringify({
          account: wallets[0],
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1210101",
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
          numbers: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        102210011,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "121010101",
        })}',
        102210010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102210012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102210010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102210020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseRaffle',
        '${JSON.stringify({
          account: wallets[0],
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1210101",
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
          numbers: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102210021,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "121010102",
        })}',
        102210020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102210022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102210020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        102210030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseRaffle',
        '${JSON.stringify({
          account: wallets[0],
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1210101",
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
          numbers: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210031,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "121010103",
        })}',
        102210030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102210030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseRaffle',
        '${JSON.stringify({
          account: wallets[1],
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1210101",
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
          numbers: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210041,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "121010104",
        })}',
        102210040,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102210040,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'PurchaseRaffle',
        '${JSON.stringify({
          account: wallets[2],
          item: {
            tokenType: 2,
            token: erc721ContractLotteryAddress,
            tokenId: "1210101",
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
          numbers: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210051,
        '${erc721ContractLotteryAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "121010105",
        })}',
        102210050,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        102210052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        102210050,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
