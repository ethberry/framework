import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther, ZeroAddress } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc998PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR || wallet;
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR || wallet;
    const erc998ContractUpgradeableAddress = process.env.ERC998_UPGRADEABLE_ADDR || wallet;

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
        10401010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: {
            tokenType: 3,
            token: erc998ContractBlacklistAddress,
            tokenId: "1040101",
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
        10401011,
        '${erc998ContractBlacklistAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010101",
        })}',
        10401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10401012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10401020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040101",
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
        10401021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010201",
        })}',
        10401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10401022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10401030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040101",
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
        10401031,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010301",
        })}',
        10401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10401032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10404010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040401",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040401",
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
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404011,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040101",
        })}',
        10404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040402",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040402",
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
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040201",
        })}',
        10404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        10404030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040403",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040403",
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
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404031,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040301",
        })}',
        10404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040404",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040404",
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
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404041,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040401",
        })}',
        10404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040405",
          item: {
            tokenType: 3,
            token: erc998ContractSimpleAddress,
            tokenId: "1040405",
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
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404051,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040501",
        })}',
        10404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10404052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        10405010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040501",
          item: {
            tokenType: 3,
            token: erc998ContractUpgradeableAddress,
            tokenId: "1040501",
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
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        10405011,
        '${erc998ContractUpgradeableAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104050101",
        })}',
        10405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        10405012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        10405020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040502",
          item: {
            tokenType: 3,
            token: erc998ContractUpgradeableAddress,
            tokenId: "1040502",
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
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        10405021,
        '${erc998ContractUpgradeableAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104050201",
        })}',
        10405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        10405022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
