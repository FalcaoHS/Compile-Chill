"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useThemeStore } from "@/lib/theme-store"
import Matter from "matter-js"
import {
  createPhysicsEngine,
  createBoundaries,
  createOrbBody,
  getPhysicsConfig,
  updatePhysics,
  createDragConstraint,
  calculateThrowForce,
  applyThrowForce,
  isPointInBody,
  getBodyPosition,
  addBodyToWorld,
  removeBodyFromWorld,
  isMobileDevice,
} from "@/lib/physics/orbs-engine"

const { Bodies, World, Engine, Events, Body } = Matter

interface UserData {
  userId: number
  avatar: string | null
  username: string
  lastLogin: string
}

interface Orb {
  id: string
  userId: number
  avatar: string | null
  username: string
  body: Matter.Body
  image: HTMLImageElement | null
  imageLoaded: boolean
}

interface DevOrbsCanvasProps {
  users: UserData[]
}

const MAX_ORBS = 10
const ORB_RADIUS_DESKTOP = 32 // 64px diameter (reduced from 96px)
const ORB_RADIUS_MOBILE = 24 // 48px diameter (reduced from 64px)
const SPAWN_INTERVAL_MS = 1000 // 1 second

/**
 * DevOrbsCanvas Component
 * 
 * Renders physics-based Dev Orbs on canvas with Matter.js integration.
 * Canvas fits viewport height minus header height (no scroll).
 */
export function DevOrbsCanvas({ users }: DevOrbsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const worldRef = useRef<Matter.World | null>(null)
  const orbsRef = useRef<Orb[]>([])
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map())
  const animationFrameRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const fpsRef = useRef<number>(60)
  const fpsHistoryRef = useRef<number[]>([])
  const lastOrbsCountRef = useRef<number>(0)
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)
  const spawnIndexRef = useRef<number>(0)
  
  // Drag state
  const dragConstraintRef = useRef<Matter.Constraint | null>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const isDraggingRef = useRef<boolean>(false)
  const draggedOrbRef = useRef<Orb | null>(null)
  
  // Basket state
  const basketHitboxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const basketShakeRef = useRef<number>(0)
  const hudMessageRef = useRef<string | null>(null)
  const hudMessageTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Physics bodies for basket
  const backboardBodyRef = useRef<Matter.Body | null>(null)
  const rimBodiesRef = useRef<Matter.Body[]>([])
  const sensorBodyRef = useRef<Matter.Body | null>(null)
  
  // Score state
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("compilechill_home_hoop_score")
    return saved ? parseInt(saved, 10) : 0
  })
  const [combo, setCombo] = useState(0)
  
  // Track orb entry into sensor
  const orbSensorStateRef = useRef<Map<number, { enteredFromTop: boolean; entryY: number }>>(new Map())
  
  // Combo reset timer
  const comboResetTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Particle system
  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    color: string
  }
  const particlesRef = useRef<Particle[]>([])
  const activeFireworksRef = useRef<number>(0)
  
  const { theme: themeId } = useThemeStore()
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("dev-orbs-visible")
    return saved !== null ? saved === "true" : true
  })

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
    const size = calculateCanvasSize()
    console.log("Canvas size calculated:", size)
    if (size.width > 0 && size.height > 0) {
      setCanvasSize(size)
    } else {
      // Retry after a short delay
      setTimeout(() => {
        const retrySize = calculateCanvasSize()
        console.log("Canvas size retry:", retrySize)
        if (retrySize.width > 0 && retrySize.height > 0) {
          setCanvasSize(retrySize)
        }
      }, 100)
    }
  }, [])

  // Get theme colors from CSS variables
  const getThemeColors = () => {
    if (typeof window === "undefined") return null

    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    return {
      primary: computedStyle.getPropertyValue("--color-primary").trim(),
      accent: computedStyle.getPropertyValue("--color-accent").trim(),
      text: computedStyle.getPropertyValue("--color-text").trim(),
      glow: computedStyle.getPropertyValue("--color-glow").trim(),
      bg: computedStyle.getPropertyValue("--color-bg").trim(),
      bgSecondary: computedStyle.getPropertyValue("--color-bg-secondary").trim(),
      border: computedStyle.getPropertyValue("--color-border").trim(),
    }
  }

  // Calculate canvas dimensions (viewport height - header height)
  const calculateCanvasSize = () => {
    if (typeof window === "undefined") return { width: 0, height: 0 }

    const headerHeight = 96 // Approximate header height (pt-24 = 96px)
    const width = window.innerWidth
    const height = window.innerHeight - headerHeight

    return { width, height }
  }

  // Load avatar image
  const loadAvatarImage = useCallback((avatarUrl: string | null, orbId: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!avatarUrl) {
        resolve(null)
        return
      }

      // Check cache
      if (imagesRef.current.has(avatarUrl)) {
        resolve(imagesRef.current.get(avatarUrl)!)
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = () => {
        imagesRef.current.set(avatarUrl, img)
        resolve(img)
      }
      
      img.onerror = () => {
        resolve(null)
      }
      
      img.src = avatarUrl
    })
  }, [])

  // Spawn a single orb
  const spawnOrb = useCallback((user: UserData, index: number) => {
    if (!engineRef.current || !worldRef.current || orbsRef.current.length >= MAX_ORBS) {
      return
    }

    const size = calculateCanvasSize()
    if (size.width === 0 || size.height === 0) return

    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
    const config = getPhysicsConfig()

    // Random horizontal position at top
    const x = radius + Math.random() * (size.width - radius * 2)
    const y = radius + 20 // Spawn slightly below top

    // Create physics body
    const body = createOrbBody(x, y, radius, config)
    
    // Create orb object
    const orb: Orb = {
      id: `orb-${user.userId}-${index}`,
      userId: user.userId,
      avatar: user.avatar,
      username: user.username,
      body,
      image: null,
      imageLoaded: false,
    }

    // Load avatar image
    if (user.avatar) {
      loadAvatarImage(user.avatar, orb.id).then((img) => {
        orb.image = img
        orb.imageLoaded = true
      })
    } else {
      orb.imageLoaded = true // No avatar to load
    }

    // Add to physics world
    addBodyToWorld(worldRef.current, body)
    orbsRef.current.push(orb)
  }, [loadAvatarImage])

  // Start sequential spawn
  const startSpawnSequence = useCallback(() => {
    // Don't restart if already spawning
    if (spawnTimerRef.current) {
      return
    }

    // Only reset spawn index if we're starting fresh (no orbs exist)
    if (orbsRef.current.length === 0) {
      console.log("DevOrbsCanvas: starting fresh spawn sequence")
      spawnIndexRef.current = 0
    } else {
      // Continue from where we left off - don't clear existing orbs!
      console.log(`DevOrbsCanvas: continuing spawn sequence. Current orbs: ${orbsRef.current.length}, spawnIndex: ${spawnIndexRef.current}`)
    }

    const spawnNext = () => {
      // Stop if we've spawned all users or reached max orbs
      if (spawnIndexRef.current >= users.length || orbsRef.current.length >= MAX_ORBS) {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current)
          spawnTimerRef.current = null
        }
        console.log(`DevOrbsCanvas: spawn sequence finished. Final orbs count: ${orbsRef.current.length}`)
        return
      }

      const user = users[spawnIndexRef.current]
      spawnOrb(user, spawnIndexRef.current)
      spawnIndexRef.current++
    }

    // Spawn first orb immediately (if we haven't spawned all yet)
    if (spawnIndexRef.current < users.length && orbsRef.current.length < MAX_ORBS) {
      spawnNext()
    }

    // Spawn remaining orbs at interval
    spawnTimerRef.current = setInterval(spawnNext, SPAWN_INTERVAL_MS)
  }, [users, spawnOrb])

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      const size = calculateCanvasSize()
      setCanvasSize(size)
    }

    handleResize() // Initial calculation
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMounted])

  // Handle valid basket (orb passed through sensor correctly)
  const handleValidBasket = useCallback((orbBody: Matter.Body) => {
    // Limit to 1-2 firework effects simultaneously
    if (activeFireworksRef.current >= 2) return

    // Update score
    setCurrentScore((prev) => {
      const newScore = prev + 1
      // Update best score
      setBestScore((currentBest) => {
        if (newScore > currentBest) {
          const newBest = newScore
          if (typeof window !== "undefined") {
            localStorage.setItem("compilechill_home_hoop_score", newBest.toString())
          }
          return newBest
        }
        return currentBest
      })
      return newScore
    })
    
    // Update combo and reset timer
    setCombo((prev) => {
      const newCombo = prev + 1
      // Reset combo after 5 seconds of no baskets
      if (comboResetTimerRef.current) {
        clearTimeout(comboResetTimerRef.current)
      }
      comboResetTimerRef.current = setTimeout(() => {
        setCombo(0)
      }, 5000)
      return newCombo
    })

    // Trigger basket shake animation
    basketShakeRef.current = 1.0

    // Show HUD message
    hudMessageRef.current = "Cesta! 🏀"

    // Clear previous timer
    if (hudMessageTimerRef.current) {
      clearTimeout(hudMessageTimerRef.current)
    }

    // Clear message after 2 seconds
    hudMessageTimerRef.current = setTimeout(() => {
      hudMessageRef.current = null
    }, 2000)

    // Create fireworks effect at sensor position
    const pos = getBodyPosition(orbBody)
    createFireworks(pos.x, pos.y)
    activeFireworksRef.current++

    // Keep orb bouncing (don't remove it)
    // Orbs stay on screen after scoring
  }, [])

  // Initialize physics engine (runs once after mount)
  useEffect(() => {
    if (!isMounted) return

    const size = calculateCanvasSize()
    if (size.width === 0 || size.height === 0) return

    // Set initial canvas size
    setCanvasSize(size)

    console.log("Initializing physics engine...", { width: size.width, height: size.height })

    // Get physics config based on device
    const config = getPhysicsConfig()

    // Create physics engine
    const engine = createPhysicsEngine(config)
    engineRef.current = engine
    worldRef.current = engine.world

    console.log("Physics engine created:", !!engineRef.current)

    // Create boundaries
    const boundaries = createBoundaries(size.width, size.height)
    boundaries.forEach((boundary) => {
      Matter.World.add(engine.world, boundary)
    })

    // Create basket physics bodies
    const basketWidth = 120
    const basketHeight = 40
    const basketX = size.width / 2 - basketWidth / 2
    const basketY = 180 // Moved down from 120
    const rimRadius = basketWidth / 2
    const backboardWidth = 80
    const backboardHeight = 40 // Reduced height to not block basket
    const backboardX = size.width / 2 - backboardWidth / 2
    const backboardY = basketY - 40 // Moved higher to not block basket opening

    // Create backboard (solid, static) - smaller and positioned to not block the basket opening
    const backboard = Bodies.rectangle(
      backboardX + backboardWidth / 2,
      backboardY + backboardHeight / 2,
      backboardWidth,
      backboardHeight,
      {
        isStatic: true,
        restitution: 0.7,
        collisionFilter: {
          category: 0x0002, // Category for backboard
          mask: 0xFFFFFFFF, // Collide with everything
        },
        render: { visible: false },
      }
    )
    backboardBodyRef.current = backboard
    Matter.World.add(engine.world, backboard)

    // Create rim (semicircle, segmented into multiple bodies for better collision)
    // Use much smaller radius and skip middle segments to create very large opening
    const rimPhysicalRadius = rimRadius * 0.70 // Rim is 70% of visual radius (creates very large opening)
    const rimSegments = 8
    const rimBodies: Matter.Body[] = []
    const skipMiddle = true
    
    for (let i = 0; i < rimSegments; i++) {
      const angle = (Math.PI / rimSegments) * i
      const normalizedAngle = angle / Math.PI // 0 to 1
      
      // Skip segments in the middle (center 50% - only keep outer 25% on each side)
      if (skipMiddle && normalizedAngle > 0.25 && normalizedAngle < 0.75) {
        continue // Skip this segment to create large opening
      }
      
      const segmentAngle = Math.PI / rimSegments
      const x1 = basketX + basketWidth / 2 + Math.cos(angle) * rimPhysicalRadius
      const y1 = basketY + Math.sin(angle) * rimPhysicalRadius
      const x2 = basketX + basketWidth / 2 + Math.cos(angle + segmentAngle) * rimPhysicalRadius
      const y2 = basketY + Math.sin(angle + segmentAngle) * rimPhysicalRadius

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const segmentLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

      const segment = Bodies.rectangle(midX, midY, segmentLength, 2, { // Even thinner rim (2px) to reduce obstruction
        isStatic: true,
        restitution: 0.7,
        angle: angle + segmentAngle / 2,
        collisionFilter: {
          category: 0x0004, // Category for rim
          mask: 0xFFFFFFFF, // Collide with everything
        },
        render: { visible: false },
      })
      rimBodies.push(segment)
      Matter.World.add(engine.world, segment)
    }
    rimBodiesRef.current = rimBodies

    // Create inner sensor (thin rectangle inside rim, isSensor: true)
    // Make sensor wider to match the larger opening
    const sensorWidth = rimPhysicalRadius * 1.8 // Even wider sensor for the large opening
    const sensorHeight = 25 // Taller sensor for easier detection
    const sensor = Bodies.rectangle(
      basketX + basketWidth / 2,
      basketY + sensorHeight / 2,
      sensorWidth,
      sensorHeight,
      {
        isStatic: true,
        isSensor: true, // Key: doesn't block physics, just detects
        render: { visible: false },
      }
    )
    sensorBodyRef.current = sensor
    Matter.World.add(engine.world, sensor)

    // Setup collision detection for sensor
    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair
        const sensorBody = sensorBodyRef.current
        if (!sensorBody) continue

        // Check if one body is the sensor and the other is an orb
        let orbBody: Matter.Body | null = null
        if (bodyA.id === sensorBody.id) {
          orbBody = bodyB
        } else if (bodyB.id === sensorBody.id) {
          orbBody = bodyA
        }

        if (orbBody) {
          // Find the orb in our orbs array
          const orb = orbsRef.current.find((o) => o.body.id === orbBody!.id)
          if (orb) {
            // Check if orb entered from above (velocity Y > 0 means moving down)
            const velocityY = orbBody.velocity.y
            const orbY = orbBody.position.y

            if (velocityY > 0 && orbY < sensorBody.position.y) {
              // Orb entered sensor from above
              orbSensorStateRef.current.set(orbBody.id, {
                enteredFromTop: true,
                entryY: orbY,
              })
            }
          }
        }
      }
    })

    Matter.Events.on(engine, "collisionEnd", (event) => {
      const pairs = event.pairs
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair
        const sensorBody = sensorBodyRef.current
        if (!sensorBody) continue

        // Check if one body is the sensor and the other is an orb
        let orbBody: Matter.Body | null = null
        if (bodyA.id === sensorBody.id) {
          orbBody = bodyB
        } else if (bodyB.id === sensorBody.id) {
          orbBody = bodyA
        }

        if (orbBody) {
          const state = orbSensorStateRef.current.get(orbBody.id)
          if (state && state.enteredFromTop) {
            // Check if orb exited downward (velocity Y > 0 and orb is below sensor)
            const velocityY = orbBody.velocity.y
            const orbY = orbBody.position.y

            if (velocityY > 0 && orbY > sensorBody.position.y) {
              // Valid basket! Orb entered from top and exited downward
              handleValidBasket(orbBody)
              orbSensorStateRef.current.delete(orbBody.id)
            }
          }
        }
      }
    })

    // Store hitbox for visual rendering
    basketHitboxRef.current = {
      x: basketX,
      y: basketY,
      width: basketWidth,
      height: basketHeight,
    }

    // Cleanup only on unmount
    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current)
      }
      Matter.Events.off(engine, "collisionStart")
      Matter.Events.off(engine, "collisionEnd")
      console.log("DevOrbsCanvas: cleaning up physics engine. Clearing orbs. Current count:", orbsRef.current.length)
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
        engineRef.current = null
        worldRef.current = null
      }
      orbsRef.current = []
      backboardBodyRef.current = null
      rimBodiesRef.current = []
      sensorBodyRef.current = null
    }
  }, [isMounted])

  // Start spawn when users are available (only once, not on every users change)
  useEffect(() => {
    console.log("Spawn effect triggered:", { usersCount: users.length, hasEngine: !!engineRef.current, currentOrbs: orbsRef.current.length })
    
    // Only start spawn if:
    // 1. We have users
    // 2. Engine is ready
    // 3. We don't have orbs yet (first time) OR we have less than max orbs and haven't spawned all users
    if (users.length > 0 && engineRef.current) {
      const shouldSpawn = orbsRef.current.length === 0 || 
                         (orbsRef.current.length < MAX_ORBS && spawnIndexRef.current < users.length)
      
      if (shouldSpawn) {
        console.log("Starting/continuing spawn sequence...")
        startSpawnSequence()
      } else {
        console.log("Spawn skipped - already have enough orbs or finished spawning")
      }
    }

    return () => {
      // Don't clear timer on users change - let it continue
      // Only clear on unmount
    }
  }, [users.length, startSpawnSequence]) // Only depend on users.length, not the whole users array

  // Update canvas dimensions and boundaries on resize
  useEffect(() => {
    if (!isMounted || !engineRef.current || !worldRef.current) return

    if (canvasRef.current) {
      canvasRef.current.width = canvasSize.width
      canvasRef.current.height = canvasSize.height
    }

    // Recreate boundaries if engine exists
    if (engineRef.current && worldRef.current) {
      // Remove old boundaries
      const bodies = Matter.Composite.allBodies(engineRef.current.world)
      bodies.forEach((body) => {
        if (body.isStatic) {
          Matter.World.remove(engineRef.current!.world, body)
        }
      })

      // Add new boundaries
      const boundaries = createBoundaries(canvasSize.width, canvasSize.height)
      boundaries.forEach((boundary) => {
        Matter.World.add(engineRef.current!.world, boundary)
      })

      // Recreate basket physics bodies on resize
      if (engineRef.current && worldRef.current) {
        // Remove old basket bodies
        if (backboardBodyRef.current) {
          Matter.World.remove(worldRef.current, backboardBodyRef.current)
        }
        rimBodiesRef.current.forEach((body) => {
          Matter.World.remove(worldRef.current, body)
        })
        if (sensorBodyRef.current) {
          Matter.World.remove(worldRef.current, sensorBodyRef.current)
        }

         // Recreate basket (same logic as initialization)
         const basketWidth = 120
         const basketHeight = 40
         const basketX = canvasSize.width / 2 - basketWidth / 2
         const basketY = 180 // Moved down from 120
        const rimRadius = basketWidth / 2
        const backboardWidth = 80
        const backboardHeight = 40 // Reduced height to not block basket
        const backboardX = canvasSize.width / 2 - backboardWidth / 2
        const backboardY = basketY - 40 // Moved higher to not block basket opening

        // Backboard - smaller and positioned to not block the basket opening
        const backboard = Bodies.rectangle(
          backboardX + backboardWidth / 2,
          backboardY + backboardHeight / 2,
          backboardWidth,
          backboardHeight,
          {
            isStatic: true,
            restitution: 0.7,
            collisionFilter: {
              category: 0x0002, // Category for backboard
              mask: 0xFFFFFFFF, // Collide with everything
            },
            render: { visible: false },
          }
        )
        backboardBodyRef.current = backboard
        Matter.World.add(worldRef.current, backboard)

         // Rim segments (use smaller radius and skip middle for very large opening)
         const rimPhysicalRadius = rimRadius * 0.70
         const rimSegments = 8
         const rimBodies: Matter.Body[] = []
         const skipMiddle = true
         
         for (let i = 0; i < rimSegments; i++) {
           const angle = (Math.PI / rimSegments) * i
           const normalizedAngle = angle / Math.PI // 0 to 1
           
           // Skip segments in the middle (center 50% - only keep outer 25% on each side)
           if (skipMiddle && normalizedAngle > 0.25 && normalizedAngle < 0.75) {
             continue // Skip this segment to create large opening
           }
          
          const segmentAngle = Math.PI / rimSegments
          const x1 = basketX + basketWidth / 2 + Math.cos(angle) * rimPhysicalRadius
          const y1 = basketY + Math.sin(angle) * rimPhysicalRadius
          const x2 = basketX + basketWidth / 2 + Math.cos(angle + segmentAngle) * rimPhysicalRadius
          const y2 = basketY + Math.sin(angle + segmentAngle) * rimPhysicalRadius

          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          const segmentLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

          const segment = Bodies.rectangle(midX, midY, segmentLength, 2, { // Even thinner rim (2px) to reduce obstruction
            isStatic: true,
            restitution: 0.7,
            angle: angle + segmentAngle / 2,
            collisionFilter: {
              category: 0x0004, // Category for rim
              mask: 0xFFFFFFFF, // Collide with everything
            },
            render: { visible: false },
          })
          rimBodies.push(segment)
          Matter.World.add(worldRef.current, segment)
        }
        rimBodiesRef.current = rimBodies

        // Sensor (wider and taller for easier detection)
        const sensorWidth = rimPhysicalRadius * 1.8
        const sensorHeight = 25
        const sensor = Bodies.rectangle(
          basketX + basketWidth / 2,
          basketY + sensorHeight / 2,
          sensorWidth,
          sensorHeight,
          {
            isStatic: true,
            isSensor: true,
            render: { visible: false },
          }
        )
        sensorBodyRef.current = sensor
        Matter.World.add(worldRef.current, sensor)

        // Update hitbox
        basketHitboxRef.current = {
          x: basketX,
          y: basketY,
          width: basketWidth,
          height: basketHeight,
        }
      }
    }
  }, [canvasSize, isMounted])

  // Get mouse/touch position relative to canvas
  const getPointerPosition = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate scale factor (canvas may be scaled for display)
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX: number
    let clientY: number
    
    if (e instanceof MouseEvent) {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // Handle touch end events
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    } else {
      return null
    }
    
    // Convert to canvas coordinates
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  // Setup pointer event listeners - define handlers directly in useEffect
  // Wait for canvas to be ready and mounted
  useEffect(() => {
    if (!isMounted) return
    
    const canvas = canvasRef.current
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) {
      // Retry after a short delay if canvas isn't ready
      const timeout = setTimeout(() => {
        const retryCanvas = canvasRef.current
        if (retryCanvas && canvasSize.width > 0 && canvasSize.height > 0) {
          // Canvas is ready, set up listeners - will be handled by next effect run
        }
      }, 100)
      return () => clearTimeout(timeout)
    }
    
    // Helper to get pointer position
    const getPointerPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      if (!canvasRef.current) return null
      const canvasEl = canvasRef.current
      const rect = canvasEl.getBoundingClientRect()
      const scaleX = canvasEl.width / rect.width
      const scaleY = canvasEl.height / rect.height
      
      let clientX: number
      let clientY: number
      
      if (e instanceof MouseEvent) {
        clientX = e.clientX
        clientY = e.clientY
      } else if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX
        clientY = e.changedTouches[0].clientY
      } else {
        return null
      }
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      }
    }

    // Handle pointer down (start drag)
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target !== canvas) return

      const pos = getPointerPos(e)
      if (!pos || !worldRef.current) return

      // Find orb at pointer position (check from back to front for top orb)
      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i]
        const orbPos = getBodyPosition(orb.body)
        const isMobile = isMobileDevice()
        const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP
        
        // Simple distance check (add some tolerance for easier clicking)
        const dx = pos.x - orbPos.x
        const dy = pos.y - orbPos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Add 5px tolerance for easier clicking
        if (distance <= radius + 5) {
          // Stop the orb's current motion
          Body.setVelocity(orb.body, { x: 0, y: 0 })
          Body.setAngularVelocity(orb.body, 0)
          
          // Make body static temporarily so it can be dragged
          Body.setStatic(orb.body, true)
          
          isDraggingRef.current = true
          draggedOrbRef.current = orb
          dragStartRef.current = pos

          // Set position immediately
          Body.setPosition(orb.body, pos)
          
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
    }

    // Handle pointer move (update drag)
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !draggedOrbRef.current) return

      const pos = getPointerPos(e)
      if (!pos) return

      // Update the body position directly for immediate response
      Body.setPosition(draggedOrbRef.current.body, pos)
      
      e.preventDefault()
      e.stopPropagation()
    }

    // Handle pointer up (end drag, throw)
    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !draggedOrbRef.current) {
        return
      }

      const pos = getPointerPos(e)
      const orb = draggedOrbRef.current
      
      // Restore body to dynamic
      Body.setStatic(orb.body, false)
      
      // Calculate throw force based on drag distance
      if (pos && dragStartRef.current) {
        const force = calculateThrowForce(dragStartRef.current, pos)
        
        // Apply throw force
        Body.setVelocity(orb.body, {
          x: force.x,
          y: force.y,
        })
      }

      // Reset drag state
      isDraggingRef.current = false
      draggedOrbRef.current = null
      dragStartRef.current = null
      
      e.preventDefault()
      e.stopPropagation()
    }

    // Canvas-specific events
    canvas.addEventListener("mousedown", onPointerDown)
    canvas.addEventListener("mousemove", onPointerMove)
    canvas.addEventListener("touchstart", onPointerDown, { passive: false })
    canvas.addEventListener("touchmove", onPointerMove, { passive: false })

    // Global events for mouseup/touchend (to handle drag even if mouse leaves canvas)
    window.addEventListener("mouseup", onPointerUp)
    window.addEventListener("touchend", onPointerUp)
    window.addEventListener("touchcancel", onPointerUp)

    return () => {
      canvas.removeEventListener("mousedown", onPointerDown)
      canvas.removeEventListener("mousemove", onPointerMove)
      canvas.removeEventListener("touchstart", onPointerDown)
      canvas.removeEventListener("touchmove", onPointerMove)
      window.removeEventListener("mouseup", onPointerUp)
      window.removeEventListener("touchend", onPointerUp)
      window.removeEventListener("touchcancel", onPointerUp)
    }
  }, [isMounted, canvasSize.width, canvasSize.height]) // Re-run when canvas is ready

  // Create fireworks particles
  const createFireworks = useCallback((x: number, y: number) => {
    const colors = getThemeColors()
    if (!colors) return

    const isMobile = isMobileDevice()
    const particleCount = isMobile ? 15 : 30 // Fewer particles on mobile

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 2 + Math.random() * 3
      
      let particleColor = colors.accent
      let particleSize = 3

      // Theme-specific particle styles
      if (themeId === "cyber") {
        // Matrix rain style
        particleColor = "#00ff00"
        particleSize = 2
      } else if (themeId === "pixel") {
        // Pixel square particles
        particleColor = colors.primary
        particleSize = 4
      } else if (themeId === "neon") {
        // Bright neon particles
        particleColor = colors.accent
        particleSize = 4
      } else if (themeId === "terminal") {
        // Random character particles (handled in render)
        particleColor = colors.text
        particleSize = 2
      }

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: particleSize,
        color: particleColor,
      })
    }
  }, [themeId])

  // Check basket collision
  const checkBasketCollision = useCallback((orb: Orb) => {
    if (!basketHitboxRef.current) return false

    const pos = getBodyPosition(orb.body)
    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP

    // Check if orb center is within basket hitbox
    const hitbox = basketHitboxRef.current
    return (
      pos.x >= hitbox.x &&
      pos.x <= hitbox.x + hitbox.width &&
      pos.y >= hitbox.y &&
      pos.y <= hitbox.y + hitbox.height
    )
  }, [])

  // Handle basket hit (old method - kept for rim/backboard collisions, but doesn't score)
  const handleBasketHit = useCallback((orb: Orb) => {
    // Rim/backboard collisions don't score, just bounce
    // This is handled by physics automatically
    // Reset combo on miss
    setCombo(0)
  }, [])

  // Update and render particles
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    // Update particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Apply gravity
      particle.vy += 0.2
      
      // Update life
      particle.life -= 0.02
      
      // Remove dead particles
      return particle.life > 0
    })

    // Update active fireworks count (decrement when particles die)
    const particlesBefore = particlesRef.current.length
    // Count is based on particle count (each firework has ~30 particles)
    activeFireworksRef.current = Math.min(2, Math.ceil(particlesRef.current.length / 30))

    // Render particles
    particlesRef.current.forEach((particle) => {
      ctx.save()

      const alpha = particle.life
      const size = particle.size * alpha

      if (themeId === "terminal") {
        // Random character particles
        ctx.fillStyle = colors.text
        ctx.globalAlpha = alpha
        ctx.font = `${size * 2}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const chars = "!@#$%^&*()[]{}|\\/<>?~`"
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, particle.x, particle.y)
      } else if (themeId === "pixel") {
        // Pixel square particles
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size)
      } else {
        // Circular particles with glow
        ctx.fillStyle = particle.color
        ctx.globalAlpha = alpha
        ctx.shadowBlur = size * 2
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      ctx.restore()
    })
  }, [themeId])

  // Render backboard
  const renderBackboard = useCallback((ctx: CanvasRenderingContext2D, backboard: Matter.Body, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    const pos = getBodyPosition(backboard)
    const width = 80
    const height = 60

    // Theme-specific backboard styling
    let boardColor = colors.bgSecondary
    let borderColor = colors.accent
    let glowIntensity = 4

    if (themeId === "neon") {
      boardColor = "rgba(0, 0, 20, 0.8)"
      borderColor = "#ff00ff"
      glowIntensity = 8
    } else if (themeId === "pixel") {
      boardColor = colors.bgSecondary
      borderColor = colors.primary
      glowIntensity = 2
    } else if (themeId === "cyber") {
      boardColor = "rgba(0, 10, 0, 0.8)"
      borderColor = "#00ff00"
      glowIntensity = 6
    } else if (themeId === "blueprint") {
      boardColor = "rgba(10, 20, 40, 0.8)"
      borderColor = "#ffffff"
      glowIntensity = 3
    }

    // Draw backboard
    ctx.fillStyle = boardColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 2
    ctx.shadowBlur = glowIntensity
    ctx.shadowColor = colors.glow

    ctx.fillRect(pos.x - width / 2, pos.y - height / 2, width, height)
    ctx.strokeRect(pos.x - width / 2, pos.y - height / 2, width, height)

    // Theme-specific textures
    if (themeId === "cyber") {
      // Scanlines
      ctx.strokeStyle = "rgba(0, 255, 0, 0.2)"
      ctx.lineWidth = 1
      for (let i = 0; i < height; i += 2) {
        ctx.beginPath()
        ctx.moveTo(pos.x - width / 2, pos.y - height / 2 + i)
        ctx.lineTo(pos.x + width / 2, pos.y - height / 2 + i)
        ctx.stroke()
      }
    } else if (themeId === "pixel") {
      // Pixel grid
      ctx.fillStyle = colors.accent
      const cellSize = 4
      for (let py = pos.y - height / 2; py < pos.y + height / 2; py += cellSize) {
        for (let px = pos.x - width / 2; px < pos.x + width / 2; px += cellSize) {
          if (Math.random() > 0.9) {
            ctx.fillRect(px, py, cellSize - 1, cellSize - 1)
          }
        }
      }
    }

    ctx.shadowBlur = 0
    ctx.restore()
  }, [themeId])

  // Render scoreboard
  const renderScoreboard = useCallback((ctx: CanvasRenderingContext2D, hitbox: { x: number; y: number; width: number; height: number }, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    const scoreboardX = hitbox.x + hitbox.width + 20 // Right of basket
    const scoreboardY = hitbox.y - 10
    const scoreboardWidth = 140
    const scoreboardHeight = 80

    // Theme-specific scoreboard styling
    let bgColor = colors.bgSecondary
    let textColor = colors.text
    let accentColor = colors.accent
    let glowIntensity = 4

    if (themeId === "neon") {
      bgColor = "rgba(0, 0, 20, 0.9)"
      textColor = "#ff00ff"
      accentColor = "#00ffff"
      glowIntensity = 8
    } else if (themeId === "pixel") {
      bgColor = colors.bgSecondary
      textColor = colors.primary
      accentColor = colors.accent
      glowIntensity = 2
    } else if (themeId === "cyber") {
      bgColor = "rgba(0, 10, 0, 0.9)"
      textColor = "#00ff00"
      accentColor = "#00ff00"
      glowIntensity = 6
    } else if (themeId === "blueprint") {
      bgColor = "rgba(10, 20, 40, 0.9)"
      textColor = "#ffffff"
      accentColor = "#4a90e2"
      glowIntensity = 3
    }

    // Draw scoreboard background
    ctx.fillStyle = bgColor
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.shadowBlur = glowIntensity
    ctx.shadowColor = colors.glow

    ctx.fillRect(scoreboardX, scoreboardY, scoreboardWidth, scoreboardHeight)
    ctx.strokeRect(scoreboardX, scoreboardY, scoreboardWidth, scoreboardHeight)

    // Draw text
    ctx.fillStyle = textColor
    ctx.font = "bold 12px monospace"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.shadowBlur = glowIntensity * 0.5

    // Current Score
    ctx.fillText("Score:", scoreboardX + 8, scoreboardY + 8)
    ctx.fillStyle = accentColor
    ctx.font = "bold 16px monospace"
    ctx.fillText(currentScore.toString(), scoreboardX + 8, scoreboardY + 24)

    // Best Score
    ctx.fillStyle = textColor
    ctx.font = "bold 12px monospace"
    ctx.fillText("Best:", scoreboardX + 8, scoreboardY + 44)
    ctx.fillStyle = accentColor
    ctx.font = "bold 16px monospace"
    ctx.fillText(bestScore.toString(), scoreboardX + 8, scoreboardY + 60)

    // Combo (if > 0)
    if (combo > 0) {
      ctx.fillStyle = textColor
      ctx.font = "bold 10px monospace"
      ctx.fillText(`Combo: ${combo}x`, scoreboardX + 8, scoreboardY + 78)
    }

    ctx.shadowBlur = 0
    ctx.restore()
  }, [themeId, currentScore, bestScore, combo])

  // Render basket with theme-specific styling and 3D depth
  const renderBasket = useCallback((ctx: CanvasRenderingContext2D, hitbox: { x: number; y: number; width: number; height: number }, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    // Calculate shake offset
    const shakeOffset = basketShakeRef.current > 0 ? (Math.random() - 0.5) * basketShakeRef.current * 4 : 0
    basketShakeRef.current = Math.max(0, basketShakeRef.current - 0.05)

    const centerX = hitbox.x + hitbox.width / 2 + shakeOffset
    const topY = hitbox.y
    const width = hitbox.width
    const rimRadius = width / 2
    const rimPhysicalRadius = rimRadius * 0.70 // Physical rim is much smaller (very large opening) - matches physics
    const rimThickness = 8 // Thick top rim
    const depth = 25 // Interior depth
    const sideAngle = 0.15 // Side angle (15% incline)

    // Theme-specific colors and effects
    let rimColor = colors.accent
    let interiorColor = colors.bgSecondary
    let glowColor = colors.glow
    let glowIntensity = 4
    let borderColor = colors.primary

    if (themeId === "neon") {
      // Neon Future: Pink/blue neon with glow
      rimColor = "#ff00ff"
      borderColor = "#00ffff"
      glowColor = "#ff00ff"
      glowIntensity = 12
      interiorColor = "rgba(0, 0, 20, 0.9)"
    } else if (themeId === "pixel") {
      // Pixel Lab: Pixelated 8-bit style
      rimColor = colors.primary
      borderColor = colors.accent
      glowColor = colors.primary
      glowIntensity = 2
      interiorColor = "rgba(0, 0, 0, 0.8)"
    } else if (themeId === "cyber") {
      // Cyber Hacker: Green with glitch
      rimColor = "#00ff00"
      borderColor = "#00ff00"
      glowColor = "#00ff00"
      glowIntensity = 8
      interiorColor = "rgba(0, 10, 0, 0.9)"
    } else if (themeId === "blueprint") {
      // Blueprint: Dark blue with white lines
      rimColor = "#1e3a5f"
      borderColor = "#ffffff"
      glowColor = "#4a90e2"
      glowIntensity = 3
      interiorColor = "rgba(10, 20, 40, 0.9)"
    } else {
      // Terminal/default
      rimColor = colors.accent
      borderColor = colors.text
      glowColor = colors.glow
      glowIntensity = 4
      interiorColor = colors.bgSecondary
    }

    // Draw interior (dark hole with depth)
    // Use rimPhysicalRadius for interior to match the larger opening
    ctx.fillStyle = interiorColor
    ctx.beginPath()
    // Top curve (semi-circle) - use physical radius for larger opening
    ctx.arc(centerX, topY, rimPhysicalRadius - rimThickness, 0, Math.PI)
    // Left side (slightly angled inward)
    ctx.lineTo(centerX - rimPhysicalRadius + rimThickness + (depth * sideAngle), topY + depth)
    // Bottom curve (semi-circle at bottom)
    ctx.arc(centerX, topY + depth, rimPhysicalRadius - rimThickness - (depth * sideAngle), Math.PI, 0, true)
    // Right side (slightly angled inward)
    ctx.lineTo(centerX + rimPhysicalRadius - rimThickness, topY)
    ctx.closePath()
    ctx.fill()

    // Theme-specific interior textures
    if (themeId === "cyber") {
      // Grid pattern
      ctx.strokeStyle = "rgba(0, 255, 0, 0.2)"
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const gridY = topY + (depth / 5) * i
        ctx.beginPath()
        ctx.moveTo(centerX - rimPhysicalRadius + rimThickness, gridY)
        ctx.lineTo(centerX + rimPhysicalRadius - rimThickness, gridY)
        ctx.stroke()
      }
      // Scanlines
      for (let i = 0; i < depth; i += 2) {
        ctx.beginPath()
        ctx.moveTo(centerX - rimPhysicalRadius + rimThickness, topY + i)
        ctx.lineTo(centerX + rimPhysicalRadius - rimThickness, topY + i)
        ctx.stroke()
      }
    } else if (themeId === "pixel") {
      // Pixelated grid
      ctx.fillStyle = colors.accent
      const cellSize = 4
      for (let py = topY; py < topY + depth; py += cellSize) {
        for (let px = centerX - rimPhysicalRadius + rimThickness; px < centerX + rimPhysicalRadius - rimThickness; px += cellSize) {
          if (Math.random() > 0.7) {
            ctx.fillRect(px, py, cellSize - 1, cellSize - 1)
          }
        }
      }
    } else if (themeId === "blueprint") {
      // Hatching lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 8) * i
        const startX = centerX - rimPhysicalRadius + rimThickness
        const startY = topY + depth / 2
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX + Math.cos(angle) * (rimPhysicalRadius * 0.6), startY + Math.sin(angle) * (rimPhysicalRadius * 0.6))
        ctx.stroke()
      }
    } else if (themeId === "neon") {
      // Gradient effect
      const gradient = ctx.createLinearGradient(centerX, topY, centerX, topY + depth)
      gradient.addColorStop(0, "rgba(255, 0, 255, 0.3)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.9)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, topY, rimPhysicalRadius - rimThickness, 0, Math.PI)
      ctx.arc(centerX, topY + depth, rimPhysicalRadius - rimThickness - (depth * sideAngle), Math.PI, 0, true)
      ctx.closePath()
      ctx.fill()
    }

    // Draw thick top rim with glow
    ctx.shadowBlur = glowIntensity
    ctx.shadowColor = glowColor
    ctx.strokeStyle = rimColor
    ctx.lineWidth = rimThickness
    ctx.lineCap = "round"
    
    // Top rim arc (thick)
    ctx.beginPath()
    ctx.arc(centerX, topY, rimRadius, 0, Math.PI)
    ctx.stroke()

    // Rim border (outer edge)
    ctx.shadowBlur = glowIntensity * 0.5
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, topY, rimRadius, 0, Math.PI)
    ctx.stroke()

    // Rim border (inner edge)
    ctx.beginPath()
    ctx.arc(centerX, topY, rimRadius - rimThickness, 0, Math.PI)
    ctx.stroke()

    // Draw angled sides
    ctx.strokeStyle = rimColor
    ctx.lineWidth = 3
    ctx.shadowBlur = glowIntensity * 0.7
    
    // Left side
    ctx.beginPath()
    ctx.moveTo(centerX - rimRadius, topY)
    ctx.lineTo(centerX - rimRadius + (depth * sideAngle), topY + depth)
    ctx.stroke()
    
    // Right side
    ctx.beginPath()
    ctx.moveTo(centerX + rimRadius, topY)
    ctx.lineTo(centerX + rimRadius - (depth * sideAngle), topY + depth)
    ctx.stroke()

    // Bottom curve (semi-circle at bottom)
    ctx.beginPath()
    ctx.arc(centerX, topY + depth, rimRadius - (depth * sideAngle), Math.PI, 0, true)
    ctx.stroke()

    // Theme-specific rim decorations
    // Neon: keep rim clean (no vertical bars) to avoid blocking visual path
    if (themeId === "cyber") {
      // Glitch effect on rim
      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        const glitchX = centerX - rimRadius + Math.random() * rimRadius * 2
        ctx.beginPath()
        ctx.moveTo(glitchX, topY - 2)
        ctx.lineTo(glitchX + (Math.random() - 0.5) * 4, topY + 2)
        ctx.stroke()
      }
    } else if (themeId === "blueprint") {
      // Coordinate points
      ctx.fillStyle = "#ffffff"
      ctx.shadowBlur = 0
      const points = [
        { x: centerX - rimRadius, y: topY },
        { x: centerX + rimRadius, y: topY },
        { x: centerX, y: topY },
      ]
      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    ctx.shadowBlur = 0
    ctx.restore()
  }, [themeId])

  // Render HUD message
  const renderHUDMessage = useCallback((ctx: CanvasRenderingContext2D, message: string, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    ctx.save()

    const x = canvasSize.width / 2
    const y = canvasSize.height / 2

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(x - 150, y - 30, 300, 60)

    // Text
    ctx.fillStyle = colors.accent
    ctx.font = "bold 24px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.shadowBlur = 8
    ctx.shadowColor = colors.glow
    ctx.fillText(message, x, y)
    ctx.shadowBlur = 0

    ctx.restore()
  }, [canvasSize])

  // Render orb with theme-specific styling
  const renderOrb = useCallback((ctx: CanvasRenderingContext2D, orb: Orb, colors: ReturnType<typeof getThemeColors>) => {
    if (!colors) return

    const pos = getBodyPosition(orb.body)
    const isMobile = isMobileDevice()
    const radius = isMobile ? ORB_RADIUS_MOBILE : ORB_RADIUS_DESKTOP

    ctx.save()

    // Theme-specific orb styling
    let borderColor = colors.accent
    let borderWidth = 2
    let glowIntensity = 4

    if (themeId === "cyber") {
      borderColor = "#00ff00" // Green for cyber
      glowIntensity = 6
    } else if (themeId === "pixel") {
      borderColor = colors.primary
      borderWidth = 3
      glowIntensity = 2
    } else if (themeId === "neon") {
      borderColor = colors.accent
      glowIntensity = 8
    } else if (themeId === "terminal") {
      borderColor = colors.text
      borderWidth = 1
      glowIntensity = 2
    }

    // Draw orb circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
    
    // Draw avatar if loaded
    if (orb.imageLoaded && orb.image) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius - borderWidth, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(orb.image, pos.x - radius + borderWidth, pos.y - radius + borderWidth, (radius - borderWidth) * 2, (radius - borderWidth) * 2)
      ctx.restore()
    } else {
      // Fallback: draw colored circle
      ctx.fillStyle = colors.primary
      ctx.fill()
    }

    // Draw border with glow
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.shadowBlur = glowIntensity
    ctx.shadowColor = colors.glow
    ctx.stroke()
    ctx.shadowBlur = 0

    // Terminal theme: ASCII representation
    if (themeId === "terminal" && !orb.image) {
      ctx.fillStyle = colors.text
      ctx.font = `${radius}px monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("()", pos.x, pos.y)
    }

    ctx.restore()
  }, [themeId])

  // Render loop
  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    let animationFrameId: number

    const render = (currentTime: number) => {
      if (!engineRef.current || !ctx) return

      // Calculate FPS
      const deltaTime = currentTime - lastFrameTimeRef.current
      if (deltaTime > 0) {
        const fps = 1000 / deltaTime
        fpsRef.current = fps

        // Track FPS history (last 60 frames)
        fpsHistoryRef.current.push(fps)
        if (fpsHistoryRef.current.length > 60) {
          fpsHistoryRef.current.shift()
        }
      }
      lastFrameTimeRef.current = currentTime

      // Check if FPS is too low (fallback to static if < 40)
      const avgFps =
        fpsHistoryRef.current.length > 0
          ? fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
          : 60

      if (avgFps < 40) {
        // Fallback: render static background only
        const colors = getThemeColors()
        if (colors) {
          ctx.fillStyle = colors.bg
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Update physics
      updatePhysics(engineRef.current)

      // Debug: log orbs count changes (to see when/why they "disappear")
      const currentOrbsCount = orbsRef.current.length
      if (currentOrbsCount !== lastOrbsCountRef.current) {
        console.log("DevOrbsCanvas: orbs count changed", lastOrbsCountRef.current, "->", currentOrbsCount)
        lastOrbsCountRef.current = currentOrbsCount
      }

      // Clear canvas
      const colors = getThemeColors()
      if (colors) {
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Collision detection is now handled by Matter.js Events
      // No need to manually check collisions here

      // Only render visuals if visible (but physics keeps running)
      if (isVisible) {
        // Render orbs
        if (colors) {
          orbsRef.current.forEach((orb) => {
            renderOrb(ctx, orb, colors)
          })
        }

        // Render basket (on top of orbs)
        if (colors && basketHitboxRef.current) {
          renderBasket(ctx, basketHitboxRef.current, colors)
        }

        // Render particles/fireworks
        if (colors) {
          renderParticles(ctx, colors)
        }

        // Render HUD message
        if (colors && hudMessageRef.current) {
          renderHUDMessage(ctx, hudMessageRef.current, colors)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [canvasSize, themeId, renderOrb, isVisible])

  // Apply theme to canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.setAttribute("data-theme", themeId)
  }, [themeId])

  // Save visibility preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-orbs-visible", isVisible.toString())
    }
  }, [isVisible])

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  if (!isMounted || canvasSize.width === 0 || canvasSize.height === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-text-secondary">Carregando canvas...</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden relative">
      {/* Toggle Button - Discreet, top right corner */}
      <button
        onClick={toggleVisibility}
        className="
          absolute top-2 right-2 z-10
          px-2 py-1
          text-xs
          text-text-secondary hover:text-text
          bg-page-secondary/80 hover:bg-page-secondary
          border border-border/50
          rounded
          opacity-60 hover:opacity-100
          transition-all
          backdrop-blur-sm
        "
        title={isVisible ? "Esconder orbs e cesta" : "Mostrar orbs e cesta"}
        aria-label={isVisible ? "Esconder orbs e cesta" : "Mostrar orbs e cesta"}
      >
        {isVisible ? "👁️" : "👁️‍🗨️"}
      </button>

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
        style={{
          display: "block",
          imageRendering: themeId === "pixel" ? "pixelated" : "auto",
          touchAction: "none", // Prevent default touch behavior
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  )
}
