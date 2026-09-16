CREATE TABLE "Goal" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "target" INTEGER NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "unit" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
