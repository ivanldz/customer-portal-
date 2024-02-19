package handler

import "github.com/gofiber/fiber/v2"

func Status(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "success", "message": "Hello i'm ok!", "data": nil})
}
