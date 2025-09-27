# QuickTouch Database Migrations

This directory contains all database migration files and utilities for the QuickTouch application.

## Structure

```
database/
├── migrations/           # SQL migration files
├── config.js            # Database configuration
├── migrate.js           # Migration runner
├── seed.js              # Database seeder
└── README.md            # This file
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   - Copy `env.example` to `.env` in the project root
   - Update database credentials in `.env`

3. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Seed database (optional):**
   ```bash
   npm run db:seed
   ```

## Available Commands

- `npm run db:migrate` - Run pending migrations
- `npm run db:rollback` - Rollback last migration
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (rollback + migrate + seed)

## Database Schema

### Core Tables

1. **Users** - User accounts and authentication
2. **PlayerProfiles** - Player-specific information
3. **PlayerStats** - Performance statistics
4. **HighlightVideos** - Player highlight videos
5. **CoachFeedback** - Coach evaluations
6. **Scouts** - Scout information
7. **ScoutFavorites** - Scout bookmarks
8. **Events** - Academy calendar events
9. **Attendance** - Event attendance tracking
10. **TrainingPlans** - Coach training programs
11. **Messages** - Future messaging system
12. **ShopItems** - Future e-commerce functionality

### Key Features

- **Foreign Key Constraints** - Maintains data integrity
- **Indexes** - Optimized for common queries
- **Timestamps** - Automatic created_at/updated_at tracking
- **Data Validation** - CHECK constraints for data quality
- **Cascade Deletes** - Proper cleanup when deleting users

## Migration Files

Each migration file follows the naming convention: `XXX_description.sql`

- `001_create_users_table.sql`
- `002_create_player_profiles_table.sql`
- `003_create_player_stats_table.sql`
- `004_create_highlight_videos_table.sql`
- `005_create_coach_feedback_table.sql`
- `006_create_scouts_table.sql`
- `007_create_scout_favorites_table.sql`
- `008_create_events_table.sql`
- `009_create_attendance_table.sql`
- `010_create_training_plans_table.sql`
- `011_create_messages_table.sql`
- `012_create_shop_items_table.sql`

## Environment Variables

Required environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quicktouch_dev
NODE_ENV=development
```

## Best Practices

1. **Always backup** your database before running migrations
2. **Test migrations** in development before production
3. **Never modify** executed migration files
4. **Create new migrations** for schema changes
5. **Use transactions** for complex migrations
6. **Validate data** with CHECK constraints

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check if MySQL server is running
   - Verify database credentials
   - Ensure database exists

2. **Migration fails:**
   - Check SQL syntax in migration file
   - Verify foreign key references
   - Check for duplicate entries

3. **Permission denied:**
   - Ensure user has CREATE/DROP privileges
   - Check file permissions for migration files

### Getting Help

- Check MySQL error logs
- Verify environment variables
- Test database connection manually
- Review migration file syntax




