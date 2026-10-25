// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title QuickTap
 * @dev Reaction-time score recording smart contract for Botchain.
 * Note: Reaction times are measured in browser and submitted by the user.
 * Scores are subject to client-side timing accuracy and can be manipulated.
 */
contract QuickTap {
    struct PlayerStats {
        uint256 bestTime;     // Best (lowest) reaction time in milliseconds (0 if unrecorded)
        uint256 attempts;     // Total number of submitted scores
        uint256 lastTime;     // Most recently submitted reaction time in milliseconds
        uint256 lastUpdated;  // Timestamp of last score submission
    }

    // Mapping storing player stats per wallet
    mapping(address => PlayerStats) public playerStats;

    // Lightweight list of all unique players for leaderboard discovery
    address[] public players;
    mapping(address => bool) private hasPlayed;

    // Event emitted upon successful score submission
    event ScoreSubmitted(
        address indexed player,
        uint256 reactionTime,
        uint256 personalBest,
        uint256 totalAttempts,
        uint256 timestamp
    );

    /**
     * @notice Submits a reaction time score in milliseconds.
     * @param reactionTimeMs The player's reaction time (must be between 1ms and 10000ms).
     */
    function submitScore(uint256 reactionTimeMs) public {
        require(reactionTimeMs >= 1 && reactionTimeMs <= 10000, "Score must be between 1ms and 10000ms");

        PlayerStats storage stats = playerStats[msg.sender];

        // Register new player in unique player list
        if (!hasPlayed[msg.sender]) {
            hasPlayed[msg.sender] = true;
            players.push(msg.sender);
        }

        stats.attempts += 1;
        stats.lastTime = reactionTimeMs;
        stats.lastUpdated = block.timestamp;

        // Update personal best if first submission or faster than previous record
        if (stats.bestTime == 0 || reactionTimeMs < stats.bestTime) {
            stats.bestTime = reactionTimeMs;
        }

        emit ScoreSubmitted(
            msg.sender,
            reactionTimeMs,
            stats.bestTime,
            stats.attempts,
            block.timestamp
        );
    }

    /**
     * @notice Alias function for submitScore.
     * @param reactionTimeMs The player's reaction time.
     */
    function submitReactionTime(uint256 reactionTimeMs) external {
        submitScore(reactionTimeMs);
    }

    /**
     * @notice Retrieve a player's best score and total attempts.
     * @param player The address of the player.
     * @return bestScore The lowest reaction time in milliseconds.
     * @return attempts The number of scores submitted by the player.
     */
    function getStats(address player) external view returns (uint256 bestScore, uint256 attempts) {
        PlayerStats memory stats = playerStats[player];
        return (stats.bestTime, stats.attempts);
    }

    /**
     * @notice Get all unique players who have submitted scores.
     * @return An array of player addresses.
     */
    function getAllPlayers() external view returns (address[] memory) {
        return players;
    }

    /**
     * @notice Get the total count of players.
     * @return The count of unique players.
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
}
