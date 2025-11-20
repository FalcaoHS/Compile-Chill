# 📋 Backlog - Compile & Chill

> 🇧🇷 [Português (PT-BR)](README.md) - Padrão / Default  
> 🇺🇸 [English (EN)](README.en.md)

This directory contains the backlog of features, improvements, and future ideas for the project.

---

## 🗺️ Quick Navigation

- **[Features](features/)** - Planned and implemented features
  - [Festive Elements System](features/festive-elements/)
- **[Improvements](improvements/)** - Performance, security, and stability
- **[Easter Eggs](easter-eggs/)** - Secret features
- **[Documentation](documentation/)** - Project presentation and history
- **[General Ideas](IDEAS.md)** - Complete list of ideas and future features

---

## 📁 Structure

```
backlog/
├── README.md                    # This file (general index)
├── IDEAS.md                     # Complete list of ideas and future features
│
├── features/                    # Planned and implemented features
│   ├── README.md
│   └── festive-elements/        # Festive elements system in orbs
│       ├── IMPLEMENTATION_STATUS.md
│       └── FUTURE_IMPROVEMENTS.md
│
├── improvements/                # Performance and security improvements
│   ├── README.md
│   ├── PERFORMANCE_IMPROVEMENTS.md
│   └── SECURITY_CHECKLIST.md
│
├── easter-eggs/                 # Easter eggs and secret features
│   ├── README.md
│   └── EASTER_EGG_99_BASKETS.md
│
└── documentation/               # Project documentation
    ├── README.md
    └── PROJECT_PRESENTATION.md
```

---

## ✅ General Status

### Recently Implemented

1. **Festive Elements System in Orbs** ✅
   - 7 supported festivities
   - Geolocation by timezone
   - User control button
   - See: `features/festive-elements/IMPLEMENTATION_STATUS.md`

2. **All 10 Games** ✅
   - Terminal 2048, Byte Match, Dev Pong, Bit Runner, Stack Overflow Dodge
   - Hack Grid, Debug Maze, Refactor Rush, Crypto Miner Game, Packet Switch

3. **Expanded Theme System** ✅
   - 11 themes available (including Chaves and PókeDev ⚡)

---

## 📊 Priorities

### 🔴 Critical (before launch)
- See: `IDEAS.md` - "Security & Compliance" section
- See: `improvements/SECURITY_CHECKLIST.md` (when filled)

### 🟡 High
- Chat moderation infra
- Score fail-safe
- Multi-tab protection
- Observability (Sentry)

### 🟢 Medium
- Audio moderation/transcription
- Drops infra
- Chess/multiplayer features
- Server-side share cards

### ⚪ Low
- Gamification extras
- Secret rooms
- Advanced analytics
- Monetization

---

## 📝 How to Contribute

1. **Add new idea:** Edit `IDEAS.md`
2. **Add feature:** Create a folder in `features/` with README.md
3. **Update status:** Edit corresponding `IMPLEMENTATION_STATUS.md` files
4. **Document feature:** Create a folder in `specs/` following the pattern `YYYY-MM-DD-feature-name`

---

## 🔗 Related Links

- **Roadmap:** `agent-os/product/roadmap.md`
- **Specifications:** `specs/`
- **Documentation:** `docs/`

---

**Last updated:** 2025-01-XX

