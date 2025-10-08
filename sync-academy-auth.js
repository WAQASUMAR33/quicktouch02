const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function syncAcademyAuth() {
  console.log('🔄 Adding authentication fields to Academies table...\n');

  try {
    // Check current columns
    console.log('1️⃣  Checking existing Academies table structure...');
    const columns = await prisma.$queryRaw`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Academies' 
      AND TABLE_SCHEMA = DATABASE()
      ORDER BY ORDINAL_POSITION
    `;
    
    console.log('   Current columns:', columns.map(c => c.COLUMN_NAME).join(', '));
    console.log('');

    // Check if password column exists
    const hasPassword = columns.some(c => c.COLUMN_NAME === 'password');
    
    if (!hasPassword) {
      console.log('2️⃣  Adding authentication fields...');
      
      // Make email NOT NULL if it isn't already
      console.log('   - Making email required...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE Academies 
        MODIFY COLUMN email VARCHAR(150) NOT NULL
      `);

      // Add password field
      console.log('   - Adding password field...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE Academies 
        ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT ''
      `);

      // Add email verification fields
      console.log('   - Adding email verification fields...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE Academies 
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN email_verification_token VARCHAR(255) NULL,
        ADD COLUMN email_verification_expiry DATETIME NULL
      `);

      // Add password reset fields
      console.log('   - Adding password reset fields...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE Academies 
        ADD COLUMN reset_token VARCHAR(255) NULL,
        ADD COLUMN reset_token_expiry DATETIME NULL
      `);

      // Add indexes
      console.log('   - Creating indexes...');
      try {
        await prisma.$executeRawUnsafe(`
          CREATE INDEX idx_academy_email_verification_token ON Academies(email_verification_token)
        `);
      } catch (e) {
        if (!e.message.includes('Duplicate key name')) {
          console.warn('     Warning: Could not create email_verification_token index');
        }
      }

      try {
        await prisma.$executeRawUnsafe(`
          CREATE INDEX idx_academy_reset_token ON Academies(reset_token)
        `);
      } catch (e) {
        if (!e.message.includes('Duplicate key name')) {
          console.warn('     Warning: Could not create reset_token index');
        }
      }

      try {
        await prisma.$executeRawUnsafe(`
          CREATE INDEX idx_academy_email_verified ON Academies(email_verified)
        `);
      } catch (e) {
        if (!e.message.includes('Duplicate key name')) {
          console.warn('     Warning: Could not create email_verified index');
        }
      }

      console.log('   ✅ Authentication fields added successfully!\n');
    } else {
      console.log('2️⃣  ✅ Authentication fields already exist\n');
    }

    // Verify the changes
    console.log('3️⃣  Verifying table structure...');
    const updatedColumns = await prisma.$queryRaw`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Academies' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME IN ('email', 'password', 'email_verified', 'email_verification_token', 'email_verification_expiry', 'reset_token', 'reset_token_expiry')
      ORDER BY ORDINAL_POSITION
    `;
    
    console.log('   Authentication fields:');
    updatedColumns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'required'})`);
    });

    console.log('\n✨ Academy authentication setup completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run: npx prisma generate');
    console.log('   2. Existing academies will need to set passwords');
    console.log('   3. Consider implementing email sending for verification');
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up academy authentication:', error.message);
    console.error('Full error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

syncAcademyAuth()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

