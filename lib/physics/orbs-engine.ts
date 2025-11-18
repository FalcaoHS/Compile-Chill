/**
 * Physics engine wrapper for Dev Orbs using Matter.js
 * 
 * Provides utilities for creating and managing physics bodies,
 * configuring physics properties, and handling drag/throw mechanics.
 */

import Matter from "matter-js"

const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint, Events, Query } = Matter

/**
 * Physics engine configuration
 */
export interface PhysicsConfig {
  gravityY: number // Between 1.2-1.6
  restitution: number // Between 0.6-0.8 (perereca effect)
  frictionAir: number // Low friction for smooth movement
  isMobile: boolean // Mobile optimization flag
}

/**
 * Default physics configuration
 */
const DEFAULT_CONFIG: PhysicsConfig = {
  gravityY: 1.4,
  restitution: 0.7,
  frictionAir: 0.01,
  isMobile: false,
}

/**
 * Mobile-optimized configuration
 */
const MOBILE_CONFIG: PhysicsConfig = {
  gravityY: 1.3, // Slightly lower gravity
  restitution: 0.65, // Slightly less bouncy to reduce chaos
  frictionAir: 0.015, // Slightly more friction
  isMobile: true,
}

/**
 * Create and configure Matter.js engine
 * 
 * @param config - Physics configuration (optional, uses defaults if not provided)
 * @returns Configured Matter.js engine
 */
export function createPhysicsEngine(config?: Partial<PhysicsConfig>): Matter.Engine {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Create engine
  const engine = Engine.create()
  
  // Configure engine settings
  engine.world.gravity.y = finalConfig.gravityY
  engine.world.gravity.scale = 0.001 // Matter.js uses scale, not direct values
  
  // Configure timing for performance
  if (finalConfig.isMobile) {
    // Lower update frequency on mobile for better performance
    engine.timing.timeScale = 0.9
  }
  
  return engine
}

/**
 * Create physics body for an orb
 * 
 * @param x - X position
 * @param y - Y position
 * @param radius - Orb radius (32-48px for 64-96px diameter)
 * @param config - Physics configuration
 * @returns Matter.js body for the orb
 */
export function createOrbBody(
  x: number,
  y: number,
  radius: number,
  config?: Partial<PhysicsConfig>
): Matter.Body {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Create circular body
  const body = Bodies.circle(x, y, radius, {
    restitution: finalConfig.restitution,
    frictionAir: finalConfig.frictionAir,
    friction: 0.1,
    density: 0.01, // Increased density to prevent orbs from overlapping (was 0.001)
    collisionFilter: {
      category: 0x0001, // Category for orbs
      mask: 0xFFFFFFFF, // Collide with everything (including other orbs)
    },
    render: {
      fillStyle: "transparent", // Canvas will handle rendering
    },
  })
  
  return body
}

/**
 * Create invisible boundary walls
 * 
 * @param width - Canvas width
 * @param height - Canvas height
 * @param wallThickness - Thickness of walls (default: 50px)
 * @returns Array of Matter.js bodies for walls
 */
export function createBoundaries(
  width: number,
  height: number,
  wallThickness: number = 50
): Matter.Body[] {
  const walls: Matter.Body[] = []
  
  // Top ceiling - allows orbs to go high but brings them back
  walls.push(
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
      isStatic: true,
      render: { visible: false }, // Invisible
    })
  )
  
  // Left wall
  walls.push(
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
      isStatic: true,
      render: { visible: false }, // Invisible
    })
  )
  
  // Right wall
  walls.push(
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
      isStatic: true,
      render: { visible: false },
    })
  )
  
  // Bottom floor
  // Position the floor slightly *inside* the visible canvas height so bodies
  // settle within view instead of disappearing below the bottom edge.
  walls.push(
    Bodies.rectangle(width / 2, height - wallThickness / 2, width, wallThickness, {
      isStatic: true,
      render: { visible: false },
    })
  )
  
  return walls
}

/**
 * Create drag constraint for orb interaction
 * 
 * @param body - Orb body to drag
 * @param mouse - Mouse position
 * @returns Matter.js constraint for dragging
 */
export function createDragConstraint(
  body: Matter.Body,
  mouse: { x: number; y: number }
): Matter.Constraint {
  // Set body to static temporarily to prevent physics from interfering
  const wasStatic = body.isStatic
  const originalMass = body.mass
  
  // Make body kinematic (can be moved but not affected by forces)
  Body.setStatic(body, false)
  Body.setMass(body, Infinity) // Infinite mass = won't be pushed by other bodies
  
  return Constraint.create({
    bodyA: body,
    pointB: { x: mouse.x, y: mouse.y },
    pointA: { x: 0, y: 0 }, // Attach to center of body
    stiffness: 0.9, // Very high stiffness for immediate response
    length: 0,
    damping: 0.1,
  })
}

/**
 * Calculate throw force based on drag distance and angle
 * 
 * @param startPos - Starting position of drag
 * @param endPos - Ending position of drag
 * @param forceMultiplier - Multiplier for throw force (default: 0.15)
 * @returns Velocity vector {x, y}
 */
export function calculateThrowForce(
  startPos: { x: number; y: number },
  endPos: { x: number; y: number },
  forceMultiplier: number = 0.15
): { x: number; y: number } {
  const dx = endPos.x - startPos.x
  const dy = endPos.y - startPos.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Scale force based on drag distance (longer drag = more force)
  const distanceMultiplier = Math.min(distance / 100, 2) // Cap at 2x
  
  return {
    x: dx * forceMultiplier * distanceMultiplier,
    y: dy * forceMultiplier * distanceMultiplier,
  }
}

/**
 * Apply throw force to orb body
 * 
 * @param body - Orb body to throw
 * @param force - Force vector {x, y}
 */
export function applyThrowForce(
  body: Matter.Body,
  force: { x: number; y: number }
): void {
  Body.setVelocity(body, force)
}

/**
 * Detect if device is mobile
 * 
 * @returns true if mobile device detected
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

/**
 * Get physics configuration based on device type
 * 
 * @returns Physics configuration (mobile or desktop)
 */
export function getPhysicsConfig(): PhysicsConfig {
  if (isMobileDevice()) {
    return MOBILE_CONFIG
  }
  return DEFAULT_CONFIG
}

/**
 * Update physics engine (should be called in game loop)
 * 
 * @param engine - Matter.js engine
 * @param deltaTime - Time since last update (optional, Matter.js handles this)
 */
export function updatePhysics(engine: Matter.Engine, deltaTime?: number): void {
  if (deltaTime) {
    Engine.update(engine, deltaTime)
  } else {
    Engine.update(engine)
  }
}

/**
 * Add body to physics world
 * 
 * @param world - Matter.js world
 * @param body - Body to add
 */
export function addBodyToWorld(world: Matter.World, body: Matter.Body): void {
  World.add(world, body)
}

/**
 * Remove body from physics world
 * 
 * @param world - Matter.js world
 * @param body - Body to remove
 */
export function removeBodyFromWorld(world: Matter.World, body: Matter.Body): void {
  World.remove(world, body)
}

/**
 * Get body position
 * 
 * @param body - Matter.js body
 * @returns Position {x, y}
 */
export function getBodyPosition(body: Matter.Body): { x: number; y: number } {
  return { x: body.position.x, y: body.position.y }
}

/**
 * Set body position
 * 
 * @param body - Matter.js body
 * @param position - New position {x, y}
 */
export function setBodyPosition(
  body: Matter.Body,
  position: { x: number; y: number }
): void {
  Body.setPosition(body, position)
}

/**
 * Check if point is inside body
 * 
 * @param body - Matter.js body
 * @param point - Point {x, y}
 * @returns true if point is inside body
 */
export function isPointInBody(
  body: Matter.Body,
  point: { x: number; y: number }
): boolean {
  // For circles, use distance check (more reliable than Query.point)
  if (body.circleRadius) {
    const dx = point.x - body.position.x
    const dy = point.y - body.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= body.circleRadius
  }
  
  // For other shapes, use Query.point
  const bodies = Query.point([body], point)
  return bodies.length > 0
}

