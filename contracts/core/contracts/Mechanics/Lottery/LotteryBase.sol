// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./extensions/SignatureValidator.sol";

abstract contract LotteryBase is AccessControl, Pausable, SignatureValidator {
  using Address for address;
  using SafeERC20 for IERC20;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  address private _ticketFactory;
  address private _acceptedToken;

  uint8 private _maxTicket = 1; // TODO change for 5000 in production
  uint256 private _timeLag = 2592; // TODO change in production: release after 2592000 seconds = 30 days
  uint8 private comm = 30; // commission 30%
  event RoundStarted(uint256 round, uint256 startTimestamp);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event Purchase(address account, uint8 ticketType, uint256 round, bool[40] numbers);
  event Released(uint256 round, uint256 amount);
  event Prize(address addr, uint256 ticketId, uint256 amount);

  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) SignatureValidator(name) {
    address account = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, account);
    _setupRole(PAUSER_ROLE, account);
    _setupRole(MINTER_ROLE, account);

    setTicketFactory(ticketFactory);
    setAcceptedToken(acceptedToken);

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    rootRound.endTimestamp = block.timestamp;
    rootRound.jackpot = 10000 ether;
    _rounds.push(rootRound);
  }

  function setTicketFactory(address ticketFactory) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(ticketFactory.isContract(), "Lottery: the factory must be a deployed contract");
    _ticketFactory = ticketFactory;
  }

  function setAcceptedToken(address acceptedToken) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(acceptedToken.isContract(), "Lottery: the factory must be a deployed contract");
    _acceptedToken = acceptedToken;
  }

  // LOTTERY

  struct Round {
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    uint256 jackpot;
    bool[][] tickets; // all round tickets
    uint8[7] values; // prize numbers
    uint8[8] aggregation; // prize counts
    bytes32 requestId;
  }

  Round[] private _rounds;

  function startRound() public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    require(prevRound.endTimestamp != 0, "Lottery: previous round is not yet finished");

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundNumber = _rounds.length - 1;

    Round storage currentRound = _rounds[roundNumber];
    currentRound.startTimestamp = block.timestamp;
    currentRound.jackpot = prevRound.aggregation[7] > 0 ? 10000 ether : prevRound.jackpot + (prevRound.total / 10);

    emit RoundStarted(roundNumber, block.timestamp);
  }

  function getAllRounds() public view returns (Round[] memory) {
    return _rounds;
  }

  function getCurrentRound() public view returns (Round memory) {
    return _rounds[_rounds.length - 1];
  }

  function getRandomNumber() internal virtual returns (bytes32 requestId);

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    require(currentRound.endTimestamp == 0, "Lottery: previous round is already finished");

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    uint256 commission = (currentRound.total * comm) / 100;
    currentRound.total -= commission;

    SafeERC20.safeTransfer(IERC20(_acceptedToken), _msgSender(), commission);

    emit RoundEnded(roundNumber, block.timestamp);
  }

  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory currentRound = _rounds[roundNumber];
    require(currentRound.endTimestamp + _timeLag < block.timestamp, "Round: is not releasable yet");

    SafeERC20.safeTransfer(IERC20(_acceptedToken), _msgSender(), currentRound.balance);

    emit Released(roundNumber, currentRound.balance);
  }

  // ROUND

  function fulfillRandomness(bytes32, uint256 randomness) internal virtual {
    // may be storage
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    bool[40] memory tmp1;
    uint8 i = 0;
    while (i < 7) {
      uint256 number = randomness % 40;
      randomness = randomness / 40;
      if (!tmp1[number]) {
        currentRound.values[i] = uint8(number);
        tmp1[number] = true;
        i++;
      }
    }

    // aggregate data
    uint256 len = currentRound.tickets.length;
    for (uint8 l = 0; l < len; l++) {
      uint8 tmp2 = 0;
      for (uint8 j = 0; j <= 7; j++) {
        if (currentRound.tickets[l][currentRound.values[j]]) {
          tmp2++;
        }
      }
      currentRound.aggregation[tmp2]++;
    }
    // sum 7 numbers jackpot into 6 numbers
    currentRound.aggregation[6] = currentRound.aggregation[6] + currentRound.aggregation[7];
  }

  // MARKETPLACE

  function purchase(
    bytes32 nonce,
    uint8 ticketType,
    bool[40] calldata numbers,
    uint256 price,
    address signer,
    bytes calldata signature
  ) external whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Lottery: Wrong signer");

    require(!_expired[nonce], "Lottery: Expired signature");
    _expired[nonce] = true;

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    require(currentRound.endTimestamp == 0, "Lottery: current round is finished");

    require(currentRound.tickets.length < _maxTicket, "Lottery: no more tickets available");
    currentRound.tickets.push(numbers);

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, ticketType, numbers, price), signature);
    require(isVerified, "Lottery: Invalid signature");

    currentRound.balance += price;
    currentRound.total += price;

    emit Purchase(account, ticketType, roundNumber, numbers);

    SafeERC20.safeTransferFrom(IERC20(_acceptedToken), _msgSender(), address(this), price);
    IERC721Ticket(_ticketFactory).mintTicket(account, ticketType, roundNumber, numbers);
  }

  function exchange(uint256 tokenId) external whenNotPaused {
    IERC721Ticket ticketFactory = IERC721Ticket(_ticketFactory);

    Ticket memory data = ticketFactory.getTicketData(tokenId);
    require(data.ticketType != 0 && data.ticketType != 3, "Lottery: this ticket is ot eligible for exchange");

    Round memory prevRound = _rounds[data.round];

    require(prevRound.endTimestamp != 0, "Lottery: previous round is not yet finished");

    uint8 result = 0;
    for (uint8 j = 0; j < 7; j++) {
      if (data.numbers[prevRound.values[j]]) {
        result++;
      }
    }

    require(result == 0, "Lottery: this ticket is ot eligible for exchange");

    ticketFactory.burn(tokenId);

    uint256 roundNumber = _rounds.length - 1;

    uint256 len = data.numbers.length;
    for (uint8 i = 0; i < len; i++) {
      if (data.numbers[i]) {
        data.numbers[i] = false;
        break;
      }
    }

    ticketFactory.mintTicket(_msgSender(), data.ticketType - 1, roundNumber, data.numbers);
  }

  function getPrize(uint256 tokenId) external {
    IERC721Ticket ticketFactory = IERC721Ticket(_ticketFactory);

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

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    uint8[8] memory aggregation = currentRound.aggregation;

    uint256 sumc;
    for (uint8 l = 0; l < 7; l++) {
      uint256 ag = aggregation[l];
      uint256 co = coefficient[l];
      sumc = sumc + (ag * co);
    }

    uint256 point = currentRound.total / sumc;

    uint8 result = 0;
    for (uint8 j = 0; j < 7; j++) {
      if (data.numbers[currentRound.values[j]]) {
        result++;
      }
    }

    uint256 amount = point * coefficient[result == 7 ? 6 : result];

    currentRound.balance -= amount;

    if (result == 7) {
      amount += currentRound.jackpot / aggregation[7];
    }

    SafeERC20.safeTransfer(IERC20(_acceptedToken), _msgSender(), amount);
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

  receive() external payable {
    revert();
  }

  // todo !DEV ONLY! delete in production
  function setDummyRound(
    bool[] calldata ticket,
    uint8[7] calldata values,
    uint8[8] calldata aggregation,
    bytes32 requestId
  ) external {

    Round memory dummyRound;
    _rounds.push(dummyRound);

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    currentRound.startTimestamp = block.timestamp;
    currentRound.endTimestamp = block.timestamp + 1;
    currentRound.balance = 10000 ether;
    currentRound.total = 10000 ether;
    currentRound.total -= (currentRound.total * comm) / 100;
    currentRound.jackpot = 10000 ether;
    currentRound.tickets.push(ticket);
    currentRound.values = values; // prize numbers
    currentRound.aggregation = aggregation;
    currentRound.requestId = requestId;
  }
  // todo !DEV ONLY! delete in production

  function setDummyTicket(bool[] calldata ticket) external {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    currentRound.tickets.push(ticket);
  }
}
