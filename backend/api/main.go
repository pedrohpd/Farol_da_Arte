package main

import (
	"backend/internal/database"
)

func main() {
	_, errDB := database.ConnectDB()
	if errDB != nil {
		panic("Failed to connect to database: " + errDB.Error())
	}
}
