import { PrismaClient, UserRole, UserStatus } from '../lib/generated/prisma';
import { hashPassword } from '../lib/server/bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin users to create
  const adminUsers = [
    {
      email: 'augustus.twinemugabe@rydmentalhealth.org',
      firstName: 'Augustus',
      lastName: 'Twinemugabe',
      name: 'Augustus Twinemugabe',
      password: 'geniusmind',
      jobTitle: 'System Administrator',
      department: 'IT',
    },
    {
      email: 'shalom.omondo@rydmentalhealth.org',
      firstName: 'Shalom',
      lastName: 'Omondo',
      name: 'Shalom Omondo',
      password: 'geniusmind',
      jobTitle: 'Administrator',
      department: 'Management',
    }
  ];

  // Create admin users
  for (const adminData of adminUsers) {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
  });
  
  if (!existingAdmin) {
      // Create admin user
      const adminPassword = await hashPassword(adminData.password);
    
    const admin = await prisma.user.create({
      data: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          name: adminData.name,
          email: adminData.email,
        password: adminPassword,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        approvedAt: new Date(),
          jobTitle: adminData.jobTitle,
          department: adminData.department,
        weeklyHours: 40,
      },
    });
    
      console.log(`✅ Created admin user: ${admin.email} (${admin.name})`);
  } else {
      console.log(`ℹ️  Admin user already exists: ${adminData.email}`);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 