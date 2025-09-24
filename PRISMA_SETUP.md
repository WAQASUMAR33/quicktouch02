# Prisma Setup Guide for QuickTouch

## 🚀 Prisma Installation Complete!

Prisma has been successfully installed and configured for your QuickTouch application. Here's what has been set up:

## 📦 What's Installed

- **Prisma CLI**: For database management and migrations
- **Prisma Client**: Type-safe database access
- **MySQL Provider**: Configured for MySQL database

## 🗄️ Database Schema

The complete database schema has been defined in `prisma/schema.prisma` with all 12 tables:

### Core Models
- **User**: User accounts with roles (player, parent, coach, scout, admin)
- **PlayerProfile**: Player-specific information
- **PlayerStat**: Performance statistics per season
- **HighlightVideo**: Player highlight videos
- **CoachFeedback**: Coach evaluations and ratings
- **Scout**: Scout information and verification
- **ScoutFavorite**: Scout player bookmarks
- **Event**: Academy calendar events
- **Attendance**: Event attendance tracking
- **TrainingPlan**: Coach training programs
- **Message**: Future messaging system
- **ShopItem**: Future e-commerce functionality

### Enums
- **UserRole**: player, parent, coach, scout, admin
- **PreferredFoot**: Left, Right, Both
- **EventType**: training, match, trial, showcase

## 🔧 Configuration

### Environment Variables
Update your `.env` file with the DATABASE_URL:
```env
DATABASE_URL="mysql://username:password@localhost:3306/quicktouch_dev?schema=public"
```

### Prisma Client
The Prisma client is configured in `src/lib/prisma.js` with:
- Development logging enabled
- Global instance for Next.js
- Proper error handling

## 📋 Available Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Apply migrations in production
npm run db:migrate:prod

# Reset database completely
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🚀 Quick Start

1. **Configure Database URL:**
   ```bash
   # Edit .env file
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/quicktouch_dev"
   ```

2. **Push Schema to Database:**
   ```bash
   npm run db:push
   ```

3. **Seed with Sample Data:**
   ```bash
   npm run db:seed
   ```

4. **Start Development:**
   ```bash
   npm run dev
   ```

## 🔄 Migration from MySQL2

The following files have been updated to use Prisma:

- ✅ `src/lib/auth.js` - Authentication functions
- ✅ `src/app/api/players/route.js` - Players API
- 🔄 Other API routes (in progress)

## 🎯 Benefits of Prisma

### Type Safety
- Full TypeScript support
- Compile-time error checking
- IntelliSense for database queries

### Developer Experience
- Auto-generated client
- Built-in query builder
- Database migrations
- Prisma Studio GUI

### Performance
- Connection pooling
- Query optimization
- Efficient data fetching

## 🛠️ Database Operations

### Creating Records
```javascript
import prisma from '@/lib/prisma';

// Create user
const user = await prisma.user.create({
  data: {
    full_name: 'John Doe',
    email: 'john@example.com',
    role: 'player'
  }
});

// Create player profile
const player = await prisma.playerProfile.create({
  data: {
    user_id: user.user_id,
    age: 18,
    position: 'Midfielder'
  }
});
```

### Querying Data
```javascript
// Get all players with stats
const players = await prisma.user.findMany({
  where: { role: 'player' },
  include: {
    player_profile: {
      include: {
        player_stats: true
      }
    }
  }
});

// Filter players
const midfielders = await prisma.user.findMany({
  where: {
    role: 'player',
    player_profile: {
      position: 'Midfielder'
    }
  }
});
```

### Updating Records
```javascript
// Update player profile
const updatedPlayer = await prisma.playerProfile.update({
  where: { player_id: 1 },
  data: {
    age: 19,
    position: 'Forward'
  }
});
```

## 🔍 Prisma Studio

Access the database GUI:
```bash
npm run db:studio
```

This opens a web interface where you can:
- View all tables and data
- Edit records directly
- Run queries
- Manage relationships

## 🚨 Important Notes

1. **Environment Variables**: Make sure your `DATABASE_URL` is correctly formatted
2. **Database Connection**: Ensure MySQL is running and accessible
3. **Schema Changes**: Use `npm run db:push` for development, `npm run db:migrate` for production
4. **Client Generation**: Run `npm run db:generate` after schema changes

## 🎉 Next Steps

1. **Configure your database URL** in `.env`
2. **Push the schema** with `npm run db:push`
3. **Seed the database** with `npm run db:seed`
4. **Start developing** with `npm run dev`

Your QuickTouch application is now powered by Prisma with full type safety and excellent developer experience! 🚀
