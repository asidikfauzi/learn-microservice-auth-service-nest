import { PrismaClient, Role, User } from "@prisma/client";
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
    const superAdminRole = await prisma.role.create({
        data: {
            role_name: 'Super Admin',
            description:
            'The highest level of administrator with full control over the system.',
        } as Role,
    });

    const adminRole = await prisma.role.create({
        data: {
          role_name: 'Admin',
          description:
            'An administrator responsible for managing specific areas of the system.',
        } as Role,
    });
    
    const userRole = await prisma.role.create({
        data: {
            role_name: 'User',
            description: 'A regular user of the system with limited permissions.',
        } as Role,
    });

    const password = 'P@ssword123!';
    const passwordHash = await bcrypt(password, 10);

    const superAdminUser = await prisma.user.create({
        data: {
            username: 'ob_superadmin',
            email: 'ob_superadmin@example.test',
            role_id: superAdminRole.id,
            password: passwordHash,
        } as User,
    });

    const adminUser = await prisma.user.create({
        data: {
            username: 'ob_admin',
            email: 'ob_admin@example.test',
            role_id: adminRole.id,
            password: passwordHash,
        } as User,
    });

    const userUser = await prisma.user.create({
        data: {
            username: 'ob_user',
            email: 'ob_user@example.test',
            role_id: userRole.id,
            password: passwordHash,
        } as User,
    });

    console.log(
        `Created roles: ${superAdminRole.role_name}, ${adminRole.role_name}, ${userRole.role_name}`,
    );
    console.log(
        `Created user: ${superAdminUser.username} with role ${superAdminRole.role_name}`,
    );
    console.log(
        `Created user: ${adminUser.username} with role ${adminRole.role_name}`,
    );
    console.log(
        `Created user: ${userUser.username} with role ${userRole.role_name}`,
    );
}

main()
    .then(async () => {
        await prisma.$disconnect
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect;
        process.exit(1);
    })