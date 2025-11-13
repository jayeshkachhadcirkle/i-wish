-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "store" TEXT NOT NULL DEFAULT 'no_store',
    "customerId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Wishlist" ("createdAt", "customerId", "handle", "id") SELECT "createdAt", "customerId", "handle", "id" FROM "Wishlist";
DROP TABLE "Wishlist";
ALTER TABLE "new_Wishlist" RENAME TO "Wishlist";
CREATE UNIQUE INDEX "Wishlist_customerId_handle_key" ON "Wishlist"("customerId", "handle");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
