package settings

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func GetVar(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}
	return os.Getenv(key)
}
