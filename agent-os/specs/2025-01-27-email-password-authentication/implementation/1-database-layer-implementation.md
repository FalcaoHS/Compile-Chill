# Task Group 1: Database Layer Implementation

## Summary
Updated Prisma User model schema to support multiple authentication providers (X OAuth, Google OAuth, and Email/Password). Created migration to add new fields while maintaining backward compatibility with existing X-authenticated users.

## Completed Tasks

### 1.2 Update Prisma User model schema ✅
- Updated `prisma/schema.prisma` with new fields:
  - Changed `xId` from `String @unique` to `String? @unique` (made optional)
  - Added `email String? @unique` (optional, unique) for email/password authentication
  - Added `passwordHash String?` (optional) for bcrypt-hashed passwords
  - Added `nameEncrypted String?` (optional) for AES-256 encrypted names
  - Changed `avatar String?` to `avatar String? @db.Text` to support base64 data
- Maintained all existing fields: name, xUsername, theme, showPublicHistory, createdAt, updatedAt
- Kept all existing relationships: accounts, sessions, scores, scoreValidationFails
- Added index on email field for query performance: `@@index([email])`
- Maintained existing indexes on xId and id

### 1.3 Create migration for schema changes ✅
- Created migration file: `prisma/migrations/20251119154730_add_email_password_google_auth_fields/migration.sql`
- Migration includes:
  - `ALTER TABLE "users" ALTER COLUMN "xId" DROP NOT NULL` - Makes xId optional
  - `ALTER TABLE "users" ALTER COLUMN "avatar" TYPE TEXT` - Changes avatar to TEXT for base64
  - `ALTER TABLE "users" ADD COLUMN "email" TEXT` - Adds email field
  - `ALTER TABLE "users" ADD COLUMN "passwordHash" TEXT` - Adds passwordHash field
  - `ALTER TABLE "users" ADD COLUMN "nameEncrypted" TEXT` - Adds nameEncrypted field
  - `CREATE INDEX "users_email_idx" ON "users"("email")` - Adds index on email
  - `CREATE UNIQUE INDEX "users_email_key" ON "users"("email") WHERE "email" IS NOT NULL` - Adds unique constraint (allows NULL)
- Migration is backward compatible: existing X-authenticated users will continue working
- All new fields are optional (nullable) to maintain compatibility

### 1.4 Verify database compatibility ✅
- Schema formatted successfully with `npx prisma format`
- Migration SQL follows PostgreSQL best practices
- Unique constraint on email allows NULL values (multiple users can have NULL email)
- Index on email will improve query performance for email lookups
- All existing relationships and constraints maintained

## Schema Changes Summary

**Before:**
```prisma
model User {
  xId String @unique  // Required
  avatar String?      // VARCHAR
  // No email, passwordHash, or nameEncrypted fields
}
```

**After:**
```prisma
model User {
  xId String? @unique           // Optional
  avatar String? @db.Text       // TEXT (for base64)
  email String? @unique         // Optional, unique
  passwordHash String?          // Optional
  nameEncrypted String?         // Optional
  @@index([email])              // New index
}
```

## Next Steps

- Task Group 2: Create security utilities (encryption, password hashing, email validation)
- Task Group 3: Configure NextAuth with Google and Credentials providers
- Task Group 4: Update API routes to handle encrypted data

## Notes

- Migration should be tested in development before applying to production
- Existing X-authenticated users will have `xId` populated and `email` as NULL
- New email/password users will have `email` and `passwordHash` populated, `xId` as NULL
- Google OAuth users will have Account record with provider "google", may have `email` populated
- All users can optionally have `nameEncrypted` for privacy

