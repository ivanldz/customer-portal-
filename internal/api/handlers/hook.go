package handler

import (
	"errors"
	"log"
	"trigger-retiro-sucursal/internal/services"

	"github.com/gofiber/fiber/v2"
)

type hook struct {
	OrderId    string `json:"OrderId"`
	State      string `json:"State"`
	HookConfig string `json:"hookConfig"`
}

func Hook(c *fiber.Ctx) error {
	var orderData hook
	if err := c.BodyParser(&orderData); err != nil {
		return err
	}

	if orderData.HookConfig == "ping" {
		return c.SendStatus(200)
	}

	if orderData.OrderId == "" || orderData.State == "" {
		return errors.New("el pedido no tiene ID o Status declarado")
	}

	log.Printf(
		"Ingresa nuevo pedido '%s' en estado '%s'",
		orderData.OrderId,
		orderData.State,
	)

	err := services.SendWithdrawalEmail(orderData.OrderId)
	if err != nil {
		log.Printf("Error sending %v", err)
		return c.SendStatus(500)
	}

	return c.SendStatus(200)
}
