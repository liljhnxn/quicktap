import { expect } from "chai";
import { ethers } from "hardhat";
import { QuickTap } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";

describe("QuickTap Contract", function () {
  let quickTap: QuickTap;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    player1 = signers[0];
    player2 = signers[1];

    const QuickTapFactory = await ethers.getContractFactory("QuickTap");
    quickTap = await QuickTapFactory.deploy();
    await quickTap.waitForDeployment();
  });

  it("should initialize with empty stats", async function () {
    const [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(0n);
    expect(attempts).to.equal(0n);
    expect(await quickTap.getPlayerCount()).to.equal(0n);
  });

  it("should allow a player to submit a valid score and update personal best", async function () {
    const tx = await quickTap.connect(player1).submitScore(250);
    await expect(tx)
      .to.emit(quickTap, "ScoreSubmitted")
      .withArgs(player1.address, 250n, 250n, 1n, (val: bigint) => val > 0n);

    const [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(250n);
    expect(attempts).to.equal(1n);
    expect(await quickTap.getPlayerCount()).to.equal(1n);
  });

  it("should reject scores below 1ms or above 10000ms", async function () {
    await expect(quickTap.connect(player1).submitScore(0)).to.be.revertedWith(
      "Score must be between 1ms and 10000ms"
    );

    await expect(quickTap.connect(player1).submitScore(10001)).to.be.revertedWith(
      "Score must be between 1ms and 10000ms"
    );

    // Boundary valid values
    await expect(quickTap.connect(player1).submitScore(1)).to.not.be.reverted;
    await expect(quickTap.connect(player2).submitScore(10000)).to.not.be.reverted;
  });

  it("should only update personal best if the new score is lower (better)", async function () {
    // First score: 300ms
    await quickTap.connect(player1).submitScore(300);
    let [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(300n);
    expect(attempts).to.equal(1n);

    // Second score: 450ms (worse, should not change best)
    await quickTap.connect(player1).submitScore(450);
    [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(300n);
    expect(attempts).to.equal(2n);

    // Third score: 180ms (better, should update best)
    await quickTap.connect(player1).submitScore(180);
    [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(180n);
    expect(attempts).to.equal(3n);
  });

  it("should work with alias submitReactionTime", async function () {
    await quickTap.connect(player1).submitReactionTime(220);
    const [bestScore, attempts] = await quickTap.getStats(player1.address);
    expect(bestScore).to.equal(220n);
    expect(attempts).to.equal(1n);
  });

  it("should track multiple players properly for leaderboard", async function () {
    await quickTap.connect(player1).submitScore(280);
    await quickTap.connect(player2).submitScore(195);
    await quickTap.connect(player1).submitScore(210);

    const players = await quickTap.getAllPlayers();
    expect(players.length).to.equal(2);
    expect(players[0]).to.equal(player1.address);
    expect(players[1]).to.equal(player2.address);

    const stats1 = await quickTap.playerStats(player1.address);
    const stats2 = await quickTap.playerStats(player2.address);

    expect(stats1.bestTime).to.equal(210n);
    expect(stats1.attempts).to.equal(2n);
    expect(stats2.bestTime).to.equal(195n);
    expect(stats2.attempts).to.equal(1n);
  });
});
