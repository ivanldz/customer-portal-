package repositories

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"trigger-retiro-sucursal/internal/entities"
	"trigger-retiro-sucursal/settings"
)

type VtexClient struct {
	accountname  string
	vtexApiKey   string
	vtexApiToken string
}

func NewVtexClient() *VtexClient {
	return &VtexClient{
		accountname:  settings.GetVar("VTEX_ACCOUNT_NAME"),
		vtexApiKey:   settings.GetVar("VTEX_APIKEY"),
		vtexApiToken: settings.GetVar("VTEX_APITOKEN"),
	}
}

func (g *VtexClient) GetOrderDetails(orderId string) (*entities.OrderDetails, error) {
	res, err := g.Request(ConfigRequest{
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

func (v *VtexClient) GetStoreBranches() (*[]entities.StoreBranch, error) {
	res, err := v.Request(ConfigRequest{
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

func (v *VtexClient) PostEmail(email entities.Email) error {
	payload, err := json.Marshal(email)
	if err != nil {
		return err
	}

	res, err := v.Request(ConfigRequest{
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

	fmt.Println("Mail sent successfully")
	return nil
}

type ConfigRequest struct {
	Endpoint string
	Method   string
	Headers  map[string]string
	Body     io.Reader
}

type Response struct {
	Data    []byte
	Status  int
	Headers http.Header
}

func (v *VtexClient) Request(conf ConfigRequest) (*Response, error) {
	url := fmt.Sprintf("https://%s.myvtex.com%s", v.accountname, conf.Endpoint)
	client := &http.Client{}
	req, err := http.NewRequest(conf.Method, url, conf.Body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("X-VTEX-API-AppKey", v.vtexApiKey)
	req.Header.Add("X-VTEX-API-AppToken", v.vtexApiToken)

	for k := range conf.Headers {
		req.Header.Add(k, conf.Headers[k])
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return &Response{Data: body, Status: res.StatusCode, Headers: res.Header}, nil
}
