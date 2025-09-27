# MySQL Connection String Guide

## 🔗 Database Connection String Format

For MySQL with Prisma, use this format in your `.env` file:

```env
DATABASE_URL="mysql://username:password@host:port/database_name?schema=public"
```

## 📝 Examples

### Local Development
```env
DATABASE_URL="mysql://root:password123@localhost:3306/quicktouch_dev?schema=public"
```

### With Custom Port
```env
DATABASE_URL="mysql://root:password123@localhost:3307/quicktouch_dev?schema=public"
```

### With IP Address
```env
DATABASE_URL="mysql://root:password123@192.168.1.100:3306/quicktouch_dev?schema=public"
```

### Remote Database
```env
DATABASE_URL="mysql://username:password@your-domain.com:3306/quicktouch_prod?schema=public"
```

## 🔧 Connection String Components

| Component | Description | Example |
|-----------|-------------|---------|
| `username` | MySQL username | `root`, `admin`, `your_username` |
| `password` | MySQL password | `password123`, `your_password` |
| `host` | Database host | `localhost`, `127.0.0.1`, `your-domain.com` |
| `port` | MySQL port (default: 3306) | `3306`, `3307` |
| `database_name` | Database name | `quicktouch_dev`, `quicktouch_prod` |
| `schema` | Schema name (optional) | `public` |

## 🚨 Important Notes

1. **URL Encoding**: If your password contains special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`

2. **Example with Special Characters**:
   ```env
   DATABASE_URL="mysql://root:pass%40word%23@localhost:3306/quicktouch_dev?schema=public"
   ```

3. **SSL Connection** (for production):
   ```env
   DATABASE_URL="mysql://username:password@host:3306/database?schema=public&sslmode=require"
   ```

## 🛠️ Setup Steps

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE quicktouch_dev;
   ```

2. **Update .env File**:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/quicktouch_dev?schema=public"
   ```

3. **Test Connection**:
   ```bash
   npm run db:push
   ```

4. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

## 🔍 Troubleshooting

### Connection Refused
- Check if MySQL is running
- Verify host and port
- Check firewall settings

### Access Denied
- Verify username and password
- Check user permissions
- Ensure user has access to the database

### Database Not Found
- Create the database first
- Check database name spelling
- Verify database exists

## 📋 Common MySQL Commands

```sql
-- Create database
CREATE DATABASE quicktouch_dev;

-- Create user
CREATE USER 'quicktouch_user'@'localhost' IDENTIFIED BY 'password';

-- Grant permissions
GRANT ALL PRIVILEGES ON quicktouch_dev.* TO 'quicktouch_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES;

-- Use database
USE quicktouch_dev;

-- Show tables
SHOW TABLES;
```

## 🎯 Quick Setup

1. **Copy the example**:
   ```bash
   cp env.example .env
   ```

2. **Edit .env with your credentials**:
   ```env
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/quicktouch_dev?schema=public"
   ```

3. **Push schema to database**:
   ```bash
   npm run db:push
   ```

4. **Seed with sample data**:
   ```bash
   npm run db:seed
   ```

Your MySQL connection is now ready! 🚀




