/*
  Warnings:

  - You are about to drop the column `sensorId` on the `Room` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_sensorId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "sensorId";

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "roomId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
