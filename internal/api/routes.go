package api

import (
	handler "trigger-retiro-sucursal/internal/api/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRoutes(app *fiber.App) {
	// Middleware
	api := app.Group("/api", logger.New())
	api.Get("/status", handler.Status)

	// Orders
	orders := api.Group("/orders")
	orders.Post("/hook", handler.Hook)
}
