package services

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"trigger-retiro-sucursal/internal/entities"
	"trigger-retiro-sucursal/internal/repositories"
	"trigger-retiro-sucursal/internal/tools"
)

func SendWithdrawalEmail(orderId string) error {
	order, err := repositories.GetOrderDetails(orderId)
	if err != nil {
		return err
	}

	slaName := order.ShippingData.LogisticsInfo[0].SelectedSLA
	var sla entities.SLA
	for _, s := range order.ShippingData.LogisticsInfo[0].Slas {
		if slaName == s.Name {
			sla = s
		}
	}

	productsList := getProductLists(order.Items)
	emailStore, err := getEmailStore(sla)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	email := entities.Email{
		OrderId:     orderId,
		Fullname:    order.ClientData.FirstName + " " + order.ClientData.LastName,
		PhoneNumber: order.ClientData.Phone,
		Dni:         order.ClientData.Document,
		PaymentMethod: order.PaymentData.Transactions[0].Payments[0].PaymentSystemName +
			"-" + order.PaymentData.Transactions[0].Payments[0].Group,
		EmailStore:   emailStore,
		ProductsList: productsList,
	}

	return repositories.PostEmail(email)
}

func getEmailStore(sla entities.SLA) (string, error) {
	var email string
	address := tools.FixUnicode(sla.PickupStoreInfo.Address.Street + " " + sla.PickupStoreInfo.Address.Number)
	branches, err := repositories.GetStoreBranches()
	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}

	for _, b := range *branches {
		// Busca la direccion por expresion regular
		pattern := tools.FixUnicode(b.Address)
		expReg := regexp.MustCompile(pattern)
		if expReg.FindString(address) != "" {
			email = b.Email
			break
		}
	}

	if email == "" {
		return email, errors.New("sucursal no encontrada")
	}

	return email, nil
}

func getProductLists(products []entities.Item) string {
	var list []string
	for _, item := range products {
		quantity := strconv.Itoa(item.Quantity)
		list = append(list, "<tr><td>"+item.ID+"</td><td>"+item.Name+"</td><td>"+quantity+"</td></tr>")
	}
	return "<table><tr><th>Sku</th><th>Nombre</th><th>Cantidad</th></tr>" + strings.Join(list, "\n") + "</table>"
}
