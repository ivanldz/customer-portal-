package repositories

import (
	"fmt"
	"io"
	"net/http"
	"trigger-retiro-sucursal/settings"
)

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

func Request(conf ConfigRequest) (*Response, error) {
	accountName := settings.GetVar("VTEX_ACCOUNT_NAME")
	url := fmt.Sprintf("https://%s.myvtex.com%s", accountName, conf.Endpoint)
	client := &http.Client{}
	req, err := http.NewRequest(conf.Method, url, conf.Body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("X-VTEX-API-AppKey", settings.GetVar("VTEX_APIKEY"))
	req.Header.Add("X-VTEX-API-AppToken", settings.GetVar("VTEX_APITOKEN"))

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
