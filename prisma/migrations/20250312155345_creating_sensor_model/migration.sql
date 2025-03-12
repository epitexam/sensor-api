-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "sensorId" INTEGER;

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "friendly_name" VARCHAR(255) NOT NULL,
    "unit_of_measurement" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "last_changed" TIMESTAMP(3) NOT NULL,
    "last_reported" TIMESTAMP(3) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_friendly_name_key" ON "Sensor"("friendly_name");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
