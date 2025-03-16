const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const hashedPassword = await argon2.hash('password123');

    await prisma.user.createMany({
        data: [
            { email: 'user1@example.com', username: 'user1', first_name: 'John', last_name: 'Doe', password: hashedPassword },
            { email: 'user2@example.com', username: 'user2', first_name: 'Jane', last_name: 'Smith', password: hashedPassword },
            { email: 'user3@example.com', username: 'user3', first_name: 'Alice', last_name: 'Brown', password: hashedPassword },
            { email: 'user4@example.com', username: 'user4', first_name: 'Bob', last_name: 'Miller', password: hashedPassword },
            { email: 'user5@example.com', username: 'user5', first_name: 'Charlie', last_name: 'Davis', password: hashedPassword },
            { email: 'admin@admin.com', username: 'admin', first_name: 'Admin', last_name: 'Admin', password: await argon2.hash(process.env.ADMIN_PASSWORD), role: 4 }
        ],
        skipDuplicates: true,
    });

    await prisma.room.createMany({
        data: [
            { name: 'Living Room', volume: 50 },
            { name: 'Kitchen', volume: 30 },
            { name: 'Bedroom', volume: 40 },
            { name: 'Bathroom', volume: 20 },
            { name: 'Garage', volume: 60 },
        ],
        skipDuplicates: true,
    });

    await prisma.sensor.createMany({
        data: [
            { friendly_name: 'Temperature Sensor', unit_of_measurement: 1, roomId: 1 },
            { friendly_name: 'Humidity Sensor', unit_of_measurement: 2, roomId: 1 },
            { friendly_name: 'CO2 Sensor', unit_of_measurement: 3, roomId: 2 },
            { friendly_name: 'Motion Sensor', unit_of_measurement: 4, roomId: 3 },
            { friendly_name: 'Light Sensor', unit_of_measurement: 5, roomId: 4 },
            { friendly_name: 'Water Leak Sensor', unit_of_measurement: 6, roomId: 5 },
        ],
        skipDuplicates: true,
    });

    const sensorHistoryData = [];
    for (let i = 1; i <= 100; i++) {
        sensorHistoryData.push({
            sensorId: (i % 6) + 1, // Répartir les historiques sur les 6 capteurs
            state: Math.floor(Math.random() * 500), // Valeur aléatoire pour l'état
            recorded_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Dates aléatoires
        });
    }

    await prisma.sensorHistory.createMany({
        data: sensorHistoryData,
        skipDuplicates: true,
    });

    await prisma.subscription.createMany({
        data: [
            { userId: 1, roomId: 1 },
            { userId: 2, roomId: 2 },
            { userId: 3, roomId: 3 },
            { userId: 4, roomId: 4 },
            { userId: 5, roomId: 5 },
        ],
        skipDuplicates: true,
    });

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
