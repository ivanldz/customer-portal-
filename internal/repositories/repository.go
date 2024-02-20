package repositories

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"trigger-retiro-sucursal/internal/entities"
)

func GetOrderDetails(orderId string) (*entities.OrderDetails, error) {
	res, err := Request(ConfigRequest{
		Endpoint: fmt.Sprintf("/api/oms/pvt/orders/%s", orderId),
		Method:   "GET",
	})

	if err != nil {
		return nil, err
	}

	if res.Status == 404 {
		return nil, fmt.Errorf("order not found")
	}

	var details entities.OrderDetails
	json.Unmarshal(res.Data, &details)

	return &details, nil
}

func GetStoreBranches() (*[]entities.StoreBranch, error) {
	res, err := Request(ConfigRequest{
		Endpoint: "/api/dataentities/SU/search?_fields=email,address,store",
		Method:   "GET",
	})

	if err != nil {
		return nil, err
	}

	if res.Status == 404 {
		return nil, fmt.Errorf("order not found")
	}

	var store []entities.StoreBranch
	json.Unmarshal(res.Data, &store)

	return &store, nil
}

func PostEmail(email entities.Email) error {
	payload, err := json.Marshal(email)
	if err != nil {
		return err
	}

	res, err := Request(ConfigRequest{
		Endpoint: "/api/dataentities/EM/documents",
		Method:   "POST",
		Body:     bytes.NewBuffer(payload),
	})

	if err != nil {
		return err
	}

	if res.Status != 201 {
		return errors.New("error creating email")
	}

	return nil
}
