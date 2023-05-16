// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../Exchange/ExchangeUtils.sol";
import "./extensions/SignatureValidator.sol";
//import "../../Exchange/SignatureValidator.sol";
import "./interfaces/IERC721Ticket.sol";
import "../../utils/constants.sol";
import "hardhat/console.sol";

// Todo add PAYMANTS_SPLITTER
abstract contract LotteryRandom is AccessControl, Pausable, SignatureValidator, Wallet {
  using Address for address;
  using SafeERC20 for IERC20;

  uint8 private _maxTicket = 2; // TODO change for 5000 in production or add to constructor
  uint256 private _timeLag = 2592; // TODO change in production: release after 2592000 seconds = 30 days or add to constructor
  uint8 internal comm = 30; // commission 30%
  event RoundStarted(uint256 round, uint256 startTimestamp);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event RoundFinalized(uint256 round, uint8[6] winValues);
  event Purchase(uint256 tokenId, address account, uint256 price, uint256 round, bool[36] numbers);
  event Released(uint256 round, uint256 amount);
  event Prize(address account, uint256 ticketId, uint256 amount);

  // LOTTERY

  struct Round {
    uint256 roundId;
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    Asset acceptedAsset;
    Asset ticketAsset;
    bool[][] tickets; // all round tickets
    uint8[6] values; // prize numbers
    uint8[7] aggregation; // prize counts
    uint256 requestId;
  }

  Round[] internal _rounds;

  constructor(string memory name) SignatureValidator(name) {
    address account = _msgSender();
    _grantRole(DEFAULT_ADMIN_ROLE, account);
    _grantRole(PAUSER_ROLE, account);
    _grantRole(MINTER_ROLE, account);

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    // rootRound.endTimestamp = 0;
    rootRound.endTimestamp = block.timestamp;
    _rounds.push(rootRound);
  }

  function startRound(Asset memory ticket, Asset memory price) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    require(prevRound.endTimestamp != 0, "Lottery: previous round is not yet finished");

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundNumber = _rounds.length - 1;

    Round storage currentRound = _rounds[roundNumber];
    currentRound.roundId = roundNumber;
    currentRound.startTimestamp = block.timestamp;
    currentRound.ticketAsset = ticket;
    currentRound.acceptedAsset = price;

    emit RoundStarted(roundNumber, block.timestamp);
  }

  function getAllRounds() public view returns (Round[] memory) {
    return _rounds;
  }

  function getCurrentRound() public view returns (Round memory) {
    return _rounds[_rounds.length - 1];
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    require(currentRound.roundId == roundNumber, "Lottery: wrong roundId");
    require(currentRound.endTimestamp == 0, "Lottery: previous round is already finished");

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    uint256 commission = (currentRound.total * comm) / 100;
    currentRound.total -= commission;

    if (commission != 0) {
      currentRound.acceptedAsset.amount = commission;
      ExchangeUtils.spend(ExchangeUtils._toArray(currentRound.acceptedAsset), _msgSender(), DisabledTokenTypes(false, false, false, false, false));
    }

    emit RoundEnded(roundNumber, block.timestamp);
  }

  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Round storage currentRound = _rounds[roundNumber];
    require(currentRound.endTimestamp + _timeLag < block.timestamp, "Round: is not releasable yet");
    require(currentRound.balance != 0, "Round: Nothing to Release");

    uint256 roundBalance = currentRound.balance;
    currentRound.balance = 0;

    currentRound.acceptedAsset.amount = roundBalance;
    ExchangeUtils.spend(ExchangeUtils._toArray(currentRound.acceptedAsset), _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Released(roundNumber, roundBalance);
  }

  // ROUND

  function fulfillRandomWords(uint256, uint256[] memory randomWords) internal virtual {
    // may be storage
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    bool[36] memory tmp1;
    uint8 i = 0;
    while (i < 6) {
      uint256 number = randomWords[0] % 36;
      randomWords[0] = randomWords[0] / 37;
      if (!tmp1[number]) {
        currentRound.values[i] = uint8(number);
        tmp1[number] = true;
        i++; // TODO unchecked
      }
    }

    // aggregate data
    uint256 len = currentRound.tickets.length;
    for (uint8 l = 0; l < len; l++) {
      uint8 tmp2 = 0;
      for (uint8 j = 0; j < 6; j++) {
        if (currentRound.tickets[l][currentRound.values[j]]) {
          tmp2++;
        }
      }
      currentRound.aggregation[tmp2]++;
    }

    emit RoundFinalized(currentRound.roundId, currentRound.values);
  }

  // MARKETPLACE

  function purchase(
    Params memory params,
    bool[36] calldata numbers,
    Asset memory price,
    bytes calldata signature
  ) external whenNotPaused {
    // Verify signature and recover signer
    address signer = _verifySignature(params, numbers, price, signature);
    // chech signer for MINTER_ROLE
    require(hasRole(MINTER_ROLE, signer), "Lottery: Wrong signer");

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    require(currentRound.endTimestamp == 0, "Lottery: current round is finished");

    require(currentRound.tickets.length < _maxTicket, "Lottery: no more tickets available");
    currentRound.tickets.push(numbers);

    address account = _msgSender();

    currentRound.balance += price.amount;
    currentRound.total += price.amount;

    ExchangeUtils.spendFrom(ExchangeUtils._toArray(price), _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    uint256 tokenId = IERC721Ticket(currentRound.ticketAsset.token).mintTicket(account, roundNumber, numbers);

    emit Purchase(tokenId, account, price.amount, roundNumber, numbers);
  }

  function getPrize(uint256 tokenId) external {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    IERC721Ticket ticketFactory = IERC721Ticket(currentRound.ticketAsset.token);

    Ticket memory data = ticketFactory.getTicketData(tokenId);

    ticketFactory.burn(tokenId);

    uint8[] memory coefficient = new uint8[](7);
    coefficient[0] = 0;
    coefficient[1] = 15;
    coefficient[2] = 50;
    coefficient[3] = 70;
    coefficient[4] = 110;
    coefficient[5] = 140;
    coefficient[6] = 220;

    uint8[7] memory aggregation = currentRound.aggregation;

    uint256 sumc;
    for (uint8 l = 0; l < 7; l++) {
      uint256 ag = aggregation[l];
      uint256 co = coefficient[l];
      sumc = sumc + (ag * co);
    }

    uint256 point = currentRound.total / sumc;

    uint8 result = 0;
    for (uint8 j = 0; j < 6; j++) {
      if (data.numbers[currentRound.values[j]]) {
        result++;
      }
    }

    uint256 amount = point * coefficient[result];
    currentRound.balance -= amount;

    currentRound.acceptedAsset.amount = amount;
    ExchangeUtils.spend(ExchangeUtils._toArray(currentRound.acceptedAsset), _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Prize(_msgSender(), tokenId, amount);
  }

  // PAUSABLE

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // COMMON

  receive() external override payable {
    revert();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
