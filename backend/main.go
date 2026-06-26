package main

import (
	"log"
	"os"

	"backend/api"
	"backend/internal/database"
	"backend/internal/models"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	db, errDB := database.ConnectDB()
	if errDB != nil {
		log.Fatalf("Failed to connect to database: %v", errDB)
	}

	if os.Getenv("DROP_TABLE") == "true" {
		log.Println("WARNING: Dropping and recreating all tables...")
		err := db.Migrator().DropTable(
			&models.OrderItem{},
			&models.Order{},
			&models.CustomOrder{},
			&models.Product{},
			&models.User{},
		)
		if err != nil {
			log.Fatalf("Failed to drop tables: %v", err)
		}

		err = db.AutoMigrate(
			&models.User{},
			&models.Product{},
			&models.Order{},
			&models.OrderItem{},
			&models.CustomOrder{},
		)
		if err != nil {
			log.Fatalf("Failed to migrate database: %v", err)
		}
		log.Println("Database reset complete.")
	}

	minioClient, errMinio := database.ConnectMinIO()
	if errMinio != nil {
		log.Fatalf("Failed to connect to MinIO: %v", errMinio)
	}

	// Setup and run Gin router
	r := api.SetupRouter(db, minioClient)
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
