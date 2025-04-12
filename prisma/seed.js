const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const hashedPassword = await argon2.hash('password123');

    const usersData = Array.from({ length: 50 }, (_, i) => ({
        email: `user${i + 1}@example.com`,
        username: `user${i + 1}`,
        first_name: `First${i + 1}`,
        last_name: `Last${i + 1}`,
        password: hashedPassword,
        role: i === 0 ? 4 : i < 10 ? 3 : 1
    }));
    await prisma.user.createMany({ data: usersData, skipDuplicates: true });

    const roomsData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Salle ${i + 1}`,
        volume: Math.floor(Math.random() * 100) + 20
    }));
    await prisma.room.createMany({ data: roomsData, skipDuplicates: true });

    const sensorsData = [];
    for (let i = 1; i <= 20; i++) {
        sensorsData.push(
            { friendly_name: `Temp Sensor ${i}`, unit_of_measurement: '°C', roomId: i },
            { friendly_name: `Humidity Sensor ${i}`, unit_of_measurement: '%', roomId: i },
            { friendly_name: `CO2 Sensor ${i}`, unit_of_measurement: 'ppm', roomId: i }
        );
    }
    await prisma.sensor.createMany({ data: sensorsData, skipDuplicates: true });

    const sensorHistoryData = [];
    for (let sensorId = 1; sensorId <= 60; sensorId++) {
        for (let i = 0; i < 150; i++) {
            sensorHistoryData.push({
                sensorId,
                state: Math.floor(Math.random() * 500),
                recorded_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
            });
        }
    }
    await prisma.sensorHistory.createMany({ data: sensorHistoryData, skipDuplicates: true });

    const subscriptionsData = [];
    for (let userId = 1; userId <= 50; userId++) {
        const numSubscriptions = Math.random() > 0.5 ? 1 : Math.floor(Math.random() * 5) + 1;
        const roomIds = new Set();
        while (roomIds.size < numSubscriptions) {
            roomIds.add(Math.floor(Math.random() * 20) + 1);
        }
        roomIds.forEach(roomId => {
            subscriptionsData.push({ userId, roomId });
        });
    }
    await prisma.subscription.createMany({ data: subscriptionsData, skipDuplicates: true });

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
