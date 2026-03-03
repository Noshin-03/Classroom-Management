#!/bin/bash

# Database Setup Script
echo "🗄️  Setting Up Database..."
echo "================================"

# Navigate to backend directory
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run migrations to create tables
echo "📋 Running migrations to create tables..."
npx sequelize-cli db:migrate

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    
    # Run seeders to populate data
    echo "🌱 Seeding database with sample data..."
    npx sequelize-cli db:seed:all
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully!"
        echo ""
        echo "📝 Sample credentials created:"
        echo "   Admin: admin@classroom.com / admin123"
        echo "   Teacher: john.smith@classroom.com / teacher123"
        echo "   Student: alice.williams@classroom.com / student123"
        echo ""
        echo "🎉 Database setup complete!"
    else
        echo "❌ Seeding failed!"
        exit 1
    fi
else
    echo "❌ Migration failed!"
    exit 1
fi
