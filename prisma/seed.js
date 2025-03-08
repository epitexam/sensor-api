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
            { email: 'admin@admin.com', username: 'admin', first_name: 'Admin', last_name: 'Admin', password: await argon2.hash(process.env.ADMIN_PASSWORD), role: 4 }
        ],
        skipDuplicates: true, // Évite d'insérer des doublons
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