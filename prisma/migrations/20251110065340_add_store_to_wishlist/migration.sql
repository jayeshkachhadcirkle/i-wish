/*
  Warnings:

  - A unique constraint covering the columns `[customerId,handle,store]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Wishlist_customerId_handle_key";

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_customerId_handle_store_key" ON "Wishlist"("customerId", "handle", "store");
