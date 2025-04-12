/*
  Warnings:

  - You are about to drop the column `last_changed` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `last_reported` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `last_updated` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Sensor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "last_changed",
DROP COLUMN "last_reported",
DROP COLUMN "last_updated",
DROP COLUMN "state";

-- CreateTable
CREATE TABLE "SensorHistory" (
    "id" SERIAL NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SensorHistory_sensorId_recorded_at_idx" ON "SensorHistory"("sensorId", "recorded_at");

-- AddForeignKey
ALTER TABLE "SensorHistory" ADD CONSTRAINT "SensorHistory_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
