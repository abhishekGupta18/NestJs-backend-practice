-- Add Migrations here........
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('Male', 'Female', 'Others');

-- CreateTable
CREATE TABLE SampleUsersTable (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "email" VARCHAR(255),
  "password" VARCHAR(255),
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "gender" "gender",
  "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  "email_verified" BOOLEAN DEFAULT false,
  "last_login" TIMESTAMP(6),
  "avatar" VARCHAR(255),
  "phone_number" VARCHAR(20),
  "reset_token" TEXT,
  "reset_token_expiry" TIMESTAMP(6),
  "city" VARCHAR(255),
  "state" VARCHAR(255),
  "country" VARCHAR(255),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);