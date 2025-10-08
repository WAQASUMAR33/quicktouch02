const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/academy/events/page.js',
  'src/app/academy/players/page.js',
  'src/app/academy/training-plans/page.js',
  'src/app/academy/profile/page.js'
];

function fixFile(filePath) {
  console.log(`\n📝 Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add import if not present
  if (!content.includes('from \'@/lib/academyAuth\'')) {
    content = content.replace(
      /import { useRouter } from 'next\/navigation';/,
      `import { useRouter } from 'next/navigation';\nimport { getAcademyData, logoutAcademy, getRoleDisplayName, getRoleColor, getNavigationItems } from '@/lib/academyAuth';`
    );
    modified = true;
    console.log('  ✅ Added imports');
  }

  // 2. Replace authentication check
  const oldAuthPattern = /const token = localStorage\.getItem\('academy_token'\);\s+const userData = localStorage\.getItem\('academy_user'\);\s+if \(!token \|\| !userData\) \{\s+router\.push\('\/academy\/login'\);\s+return;\s+\}\s+const parsedUser = JSON\.parse\(userData\);\s+const allowedRoles = \[.*?\];\s+if \(!allowedRoles\.includes\(parsedUser\.role\)\) \{\s+router\.push\('\/academy\/login'\);\s+return;\s+\}\s+setUser\(parsedUser\);/gs;
  
  if (content.match(oldAuthPattern)) {
    content = content.replace(
      oldAuthPattern,
      `const academyData = getAcademyData();\n    \n    if (!academyData) {\n      router.push('/academy/login');\n      return;\n    }\n\n    setUser(academyData);`
    );
    modified = true;
    console.log('  ✅ Updated authentication check');
  }

  // 3. Replace logout function
  content = content.replace(
    /const handleLogout = \(\) => \{\s+localStorage\.removeItem\('academy_token'\);\s+localStorage\.removeItem\('academy_user'\);\s+router\.push\('\/academy\/login'\);\s+\};/g,
    `const handleLogout = () => {\n    logoutAcademy();\n    router.push('/academy/login');\n  };`
  );
  if (content.includes('logoutAcademy')) {
    modified = true;
    console.log('  ✅ Updated logout function');
  }

  // 4. Remove getRoleDisplayName function
  content = content.replace(
    /const getRoleDisplayName = \(role\) => \{[\s\S]*?\};/,
    ''
  );
  
  // 5. Remove getRoleColor function  
  content = content.replace(
    /const getRoleColor = \(role\) => \{[\s\S]*?\};/,
    ''
  );

  // 6. Remove getNavigationItems function
  content = content.replace(
    /const getNavigationItems = \(\) => \{[\s\S]*?return baseItems;\s+\};/,
    ''
  );

  if (modified) {
    // Clean up multiple blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ File updated successfully');
    return true;
  } else {
    console.log('  ⚠️  No changes needed');
    return false;
  }
}

console.log('🔧 Fixing academy authentication in all pages...\n');

let fixedCount = 0;
for (const file of filesToFix) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`  ❌ Error fixing ${file}:`, error.message);
  }
}

console.log(`\n✨ Fixed ${fixedCount} out of ${filesToFix.length} files!\n`);

