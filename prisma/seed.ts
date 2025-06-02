import { PrismaClient, UserRole, UserStatus } from '../lib/generated/prisma';
import { hashPassword } from '../lib/server/bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Default admin credentials
  const adminEmail = 'lawmwad@gmail.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  
  if (!existingAdmin) {
    // Create a default admin user
    const adminPassword = await hashPassword('geniusmind');
    
    const admin = await prisma.user.create({
      data: {
        firstName: 'Mawanda',
        lastName: 'Lawrence',
        name: 'Mawanda Lawrence',
        email: adminEmail,
        password: adminPassword,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        approvedAt: new Date(),
        jobTitle: 'System Administrator',
        department: 'IT',
        weeklyHours: 40,
      },
    });
    
    console.log(`Created admin user with email: ${admin.email}`);
  } else {
    console.log('Admin user already exists, skipping creation');
  }

  // Create sample volunteer user (pending approval)
  const volunteerEmail = 'volunteer@example.com';
  const existingVolunteer = await prisma.user.findUnique({
    where: { email: volunteerEmail },
  });

  if (!existingVolunteer) {
    const volunteerPassword = await hashPassword('Volunteer123!');
    
    const volunteer = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Volunteer',
        name: 'Jane Volunteer',
        email: volunteerEmail,
        password: volunteerPassword,
        role: UserRole.VOLUNTEER,
        status: UserStatus.PENDING, // Requires admin approval
        jobTitle: 'Mental Health Champion',
        department: 'Community Outreach',
        location: 'Kampala',
        district: 'Kampala',
        region: 'Central',
        phone: '+256700000000',
        skills: 'Counseling, Community Mobilization',
        weeklyHours: 20,
      },
    });
    
    console.log(`Created volunteer user with email: ${volunteer.email} (status: ${volunteer.status})`);
  } else {
    console.log('Volunteer user already exists, skipping creation');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 