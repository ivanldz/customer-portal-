package services

import (
	"fmt"
	"trigger-retiro-sucursal/internal/entities"
	"trigger-retiro-sucursal/internal/repositories"
)

func IntegrateToLocker(orderData entities.HookData) error {
	vtex := repositories.NewVtexClient()
	order, err := vtex.GetOrderDetails(orderData.OrderId)
	if err != nil {
		return err
	}

	if !IsOrderValid(order) {
		return nil
	}

	bw := repositories.NewBoxewayClient()
	bw.Login()

	lockers, err := bw.GetELockers()
	if err != nil {
		return err
	}

	if len(lockers.Content.Elockers) < 1 {
		return fmt.Errorf("not available lockers")
	}

	lockerId := lockers.Content.Elockers[0].ID

	lockerSize, err := bw.GetELockersSize(lockerId)
	if err != nil {
		return err
	}
	if len(lockerSize.Content) < 1 {
		return fmt.Errorf("not available lockersSize")
	}
	lockerSizeId := lockerSize.Content[0].ID

	err = bw.OperationPickup(entities.OperationPickup{
		LockerId:          lockerId,
		LockerIdSize:      lockerSizeId,
		Email:             order.ClientData.Email,
		Phone:             order.ClientData.Phone,
		ReceiptName:       order.ClientData.FirstName + " " + order.ClientData.LastName,
		ExternalReference: order.OrderID,
	})
	if err != nil {
		return err
	}

	return nil
}

func IsOrderValid(order *entities.OrderDetails) bool {
	sla := order.ShippingData.LogisticsInfo[0].SelectedSLA
	return sla == "Retirar en sucursal (14f49b0)"
}
