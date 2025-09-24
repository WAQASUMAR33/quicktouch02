# QuickTouch Academy Management System - Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the QuickTouch Academy Management System with all the features you requested.

## 📋 Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- Git installed

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup with Prisma

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE quicktouch_dev;
   ```

2. **Configure Environment Variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/quicktouch_dev?schema=public"
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Push Database Schema:**
   ```bash
   npm run db:push
   ```

5. **Seed Database with Sample Data:**
   ```bash
   npm run db:seed
   ```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🎯 Features Implemented

### ✅ Player Profiles
- **Personal Details**: Full name, age, height, weight, position, preferred foot
- **Profile Creation**: Complete form with validation
- **Profile Viewing**: Comprehensive player cards with statistics
- **Profile Editing**: Update player information

### ✅ Highlight Reels
- **Video Upload**: Support for MP4, MOV, AVI files (up to 50MB)
- **Video Gallery**: Display uploaded videos on player profiles
- **Video Management**: Upload, view, and organize highlight videos

### ✅ Match Stats
- **Statistics Tracking**: Goals, assists, matches played, minutes
- **Season-based Stats**: Track performance across different seasons
- **Statistics Display**: Visual representation of player performance

### ✅ Coach Feedback
- **Rating System**: 1-5 star rating for player performance
- **Written Feedback**: Detailed notes from coaches
- **Feedback History**: View all feedback received by players

### ✅ Scout Access (VIP Mode)
- **Player Browsing**: View all verified player profiles
- **Advanced Filtering**: Filter by age, position, goals, assists
- **Favorite Players**: Save and manage favorite players
- **Contact System**: Direct messaging to academy admins
- **Player Search**: Find players based on specific criteria

### ✅ Academy Calendar
- **Event Management**: Training sessions, matches, trials, showcases
- **Calendar View**: Monthly calendar with event visualization
- **Event Creation**: Add new events with details
- **Event Types**: Different colors for different event types

### ✅ Attendance Tracking
- **Mark Attendance**: Present/absent for each event
- **Performance Ratings**: Rate player performance during events
- **Attendance Reports**: View attendance statistics
- **Notes System**: Add performance notes for each player

### ✅ Admin & Coach Tools
- **Player Management**: View and manage all player profiles
- **Event Management**: Create and manage academy events
- **Attendance Tracking**: Mark attendance for events
- **Performance Monitoring**: Track player progress

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Players
- `GET /api/players` - Get all players (with filtering)
- `POST /api/players` - Create player profile
- `GET /api/players/[id]` - Get specific player
- `PUT /api/players/[id]` - Update player profile

### Videos
- `POST /api/videos/upload` - Upload highlight video

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Scout Features
- `GET /api/scout/favorites` - Get scout favorites
- `POST /api/scout/favorites` - Add to favorites
- `DELETE /api/scout/favorites/[id]` - Remove from favorites
- `POST /api/scout/contact` - Contact academy about player

## 🎨 User Interface

### Player Dashboard
- View personal profile
- Upload highlight videos
- Track match statistics
- View coach feedback

### Scout Dashboard
- Browse player profiles
- Filter by criteria
- Save favorites
- Contact academy

### Coach Dashboard
- Manage player profiles
- Create events
- Track attendance
- Provide feedback

### Admin Dashboard
- Manage all users
- Oversee academy operations
- Generate reports
- System administration

## 🔐 User Roles

1. **Player**: Create profile, upload videos, view stats
2. **Parent**: View child's progress, receive updates
3. **Coach**: Manage players, create events, track attendance
4. **Scout**: Browse players, save favorites, contact academy
5. **Admin**: Full system access and management

## 📱 Responsive Design

- Mobile-friendly interface
- Tablet optimization
- Desktop experience
- Touch-friendly controls

## 🚀 Deployment

### Production Setup

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   DB_HOST=your_production_db_host
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   DB_NAME=quicktouch_prod
   JWT_SECRET=your_secure_jwt_secret
   ```

2. **Build Application:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

## 🔧 Database Management with Prisma

### Prisma Commands
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Create and apply migrations
npm run db:migrate:prod # Apply migrations in production
npm run db:reset      # Reset database completely
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Prisma Studio (database GUI)
```

### Database Schema
- **Users**: User accounts and authentication
- **PlayerProfiles**: Player-specific information
- **PlayerStats**: Performance statistics
- **HighlightVideos**: Player highlight videos
- **CoachFeedback**: Coach evaluations
- **Scouts**: Scout information
- **ScoutFavorites**: Scout bookmarks
- **Events**: Academy calendar events
- **Attendance**: Event attendance tracking
- **TrainingPlans**: Coach training programs
- **Messages**: Future messaging system
- **ShopItems**: Future e-commerce functionality

## 🎯 Next Steps

1. **Set up your database** using the migration commands
2. **Configure environment variables** in `.env`
3. **Run the application** with `npm run dev`
4. **Create user accounts** through the registration system
5. **Start adding players** and creating events

## 📞 Support

If you encounter any issues:
1. Check the database connection
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check the console for error messages

## 🎉 Congratulations!

You now have a fully functional academy management system with all the requested features:

- ✅ Player Profiles with personal details
- ✅ Highlight Reels with video upload
- ✅ Match Stats tracking
- ✅ Coach Feedback system
- ✅ Scout VIP access with filtering
- ✅ Academy Calendar with events
- ✅ Attendance Tracking
- ✅ Admin & Coach tools

The system is ready for use and can be extended with additional features as needed!
