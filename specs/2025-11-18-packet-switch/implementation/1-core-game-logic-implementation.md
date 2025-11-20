# Implementation Report: Core Game Logic

**Task Group:** 1 - Core Game Logic  
**Date:** 2025-11-18  
**Status:** ✅ Complete

---

## Summary

Implemented the core game logic for Packet Switch, including game state management, node system, link system, packet system, packet routing logic, game completion detection, and score calculation. The implementation follows patterns from Hack Grid and Terminal 2048 game logic.

---

## Files Created

### `lib/games/packet-switch/game-logic.ts`
Core game logic module containing:

**Game State Interface:**
- `GameState` - Main game state with level, nodes, links, activePackets, completedPackets, timing, and metrics
- `Node` - Node structure with id, x, y, type (source/destination/router), and state
- `Link` - Link structure with from/to node IDs
- `Packet` - Packet structure with id, sourceNodeId, destinationNodeId, currentNodeId, targetNodeId, progress, hops
- `Level` - Level structure with nodes, links, sourceNodeId, destinationNodeId, packetsToSend, difficulty

**Constants:**
- PACKET_SPEED: 0.02 (progress increment per frame)
- DURATION_PENALTY_DIVISOR: 1000

**Core Functions:**
1. `createInitialGameState()` - Initialize game with level data
2. `isValidNodePosition()` - Validate node position within viewport bounds
3. `linkExists()` - Check if link exists between two nodes (bidirectional)
4. `getNodeById()` - Get node by ID
5. `routePacketToNode()` - Route packet to target node
6. `updatePacketPositions()` - Update packet positions each frame
7. `checkCompletion()` - Check if all packets reached destinations
8. `calculateScore()` - Calculate score based on packets delivered, time, hops, difficulty
9. `getScoreData()` - Get score data for API submission
10. `loadLevelByNumber()` - Load level by level number
11. `loadDefaultLevel()` - Load default level (level 1)
12. `getNextLevel()` - Get next level number
13. `resetGame()` - Reset game to initial state

---

## Implementation Details

**Packet Routing:**
- Players click/tap nodes to route packets
- Packets automatically travel along links from current node to target node
- Progress tracked from 0 to 1 along each link
- Hops count incremented when packet reaches a node
- Multiple packets can be active simultaneously

**Score Calculation:**
- Formula: `scoreFinal = packetsDelivered * difficulty / averageHops – durationPenalty`
- Duration penalty: `duration / 1000` (seconds)
- Returns non-negative integer score

**Game Completion:**
- Detects when all packets reach their destinations
- Calculates final metrics (duration, average hops)
- Sets completion and gameOver flags

---

## Notes

- Game logic is pure and testable
- Packet routing validates link existence before routing
- Node states reset to idle when packets move (except source/destination)
- Score calculation handles edge cases (division by zero, negative scores)
- Level loading validates level structure

