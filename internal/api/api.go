package api

import (
	"log"
	"trigger-retiro-sucursal/settings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func Start() {
	port := settings.GetVar("PORT")
	app := fiber.New(fiber.Config{
		ServerHeader: "Fiber",
		AppName:      "Api dashboard-store-branches v1.0.0",
	})

	app.Use(cors.New())

	SetupRoutes(app)
	log.Fatal(app.Listen(port))
}
