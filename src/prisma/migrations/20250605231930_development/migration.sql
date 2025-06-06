-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "shortener_url" TEXT NOT NULL,
    "owner_id" TEXT,
    "accesses_qty" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "previous_url_id" TEXT,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_urls_shortener_url_owner_id" ON "urls"("shortener_url", "owner_id");

-- CreateIndex
CREATE INDEX "idx_urls_original_url_original_url" ON "urls"("original_url", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "urls_original_url_owner_id_key" ON "urls"("original_url", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortener_url_owner_id_key" ON "urls"("shortener_url", "owner_id");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_previous_url_id_fkey" FOREIGN KEY ("previous_url_id") REFERENCES "urls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
