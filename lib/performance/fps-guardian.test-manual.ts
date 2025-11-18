/**
 * Manual Test Script for FPS Guardian
 * 
 * This script can be run manually to verify FPS Guardian behavior.
 * Since the project doesn't have a test framework configured, this serves
 * as both documentation and a manual verification tool.
 * 
 * To run: Import this file and call runManualTests() in a browser console
 * or Node.js environment.
 */

import { useFPSGuardianStore, getFPSLevel, isFPSLevelAtLeast, isFPSLevelAtMost } from './fps-guardian'

export function runManualTests() {
  console.log('🧪 Running FPS Guardian Manual Tests...\n')
  
  let passed = 0
  let failed = 0
  
  function test(name: string, fn: () => boolean) {
    try {
      const result = fn()
      if (result) {
        console.log(`✅ ${name}`)
        passed++
      } else {
        console.error(`❌ ${name}`)
        failed++
      }
    } catch (error) {
      console.error(`❌ ${name} - Error:`, error)
      failed++
    }
  }
  
  // Reset store before tests
  useFPSGuardianStore.getState().reset()
  
  // Test 1: FPS History Tracking
  test('FPS history tracks 60 frames', () => {
    const store = useFPSGuardianStore.getState()
    for (let i = 0; i < 60; i++) {
      store.setFPS(60)
    }
    return store.fpsHistory.length === 60
  })
  
  // Test 2: Level 0 Detection (FPS ≥ 50)
  test('Level 0 detected when FPS ≥ 50', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 60; i++) {
      store.setFPS(55)
    }
    return store.level === 0
  })
  
  // Test 3: Level 1 Detection (40 ≤ FPS < 50)
  test('Level 1 detected when 40 ≤ FPS < 50', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 60; i++) {
      store.setFPS(45)
    }
    return store.level === 1
  })
  
  // Test 4: Level 2 Detection (FPS < 40)
  test('Level 2 detected when FPS < 40', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 60; i++) {
      store.setFPS(35)
    }
    return store.level === 2
  })
  
  // Test 5: Average FPS Calculation
  test('Average FPS calculated correctly', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    store.setFPS(50)
    store.setFPS(55)
    store.setFPS(60)
    const expected = (50 + 55 + 60) / 3
    return Math.abs(store.averageFPS - expected) < 0.1
  })
  
  // Test 6: Global State Export
  test('Global FPS level exported correctly', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 60; i++) {
      store.setFPS(45)
    }
    return getFPSLevel() === store.level
  })
  
  // Test 7: Utility Functions
  test('Utility functions work correctly', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 60; i++) {
      store.setFPS(55)
    }
    return (
      isFPSLevelAtLeast(0) === true &&
      isFPSLevelAtLeast(1) === false &&
      isFPSLevelAtMost(0) === true &&
      isFPSLevelAtMost(1) === true
    )
  })
  
  // Test 8: History Size Limit
  test('History maintains only last 60 frames', () => {
    const store = useFPSGuardianStore.getState()
    store.reset()
    for (let i = 0; i < 100; i++) {
      store.setFPS(60)
    }
    return store.fpsHistory.length === 60
  })
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  (window as any).runFPSGuardianTests = runManualTests
}

