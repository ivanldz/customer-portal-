package repositories

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"trigger-retiro-sucursal/internal/entities"
	"trigger-retiro-sucursal/settings"
)

type BoxewayClient struct {
	apiKey      string
	secret      string
	accessToken string
	baseUrl     string
}

func NewBoxewayClient() *BoxewayClient {
	return &BoxewayClient{
		apiKey:  settings.GetVar("BOXEWAY_API_KEY"),
		secret:  settings.GetVar("BOXEWAY_SECRET"),
		baseUrl: "http://api.boxeway.com/api",
	}
}

func (b *BoxewayClient) Login() error {
	url := "http://auth.boxeway.com/token/generate"
	payload := strings.NewReader(fmt.Sprintf("api_key=%s&api_secret=%s", b.apiKey, b.secret))
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var lresponse entities.LoginResponse
	err = json.Unmarshal(body, &lresponse)
	if err != nil {
		return err
	}

	b.accessToken = lresponse.Content
	return nil
}

func (b *BoxewayClient) OperationPickup(operation entities.OperationPickup) error {

	data := url.Values{}
	data.Set("token", b.accessToken)
	data.Set("id_elocker", operation.LockerId)
	data.Set("id_locker_size", strconv.Itoa(operation.LockerIdSize))
	data.Set("receipt", operation.ReceiptName)
	data.Set("email", operation.Email)
	data.Set("phone", operation.Phone)
	data.Set("external_reference", operation.ExternalReference)
	payload := strings.NewReader(data.Encode())

	client := &http.Client{}
	r, _ := http.NewRequest(
		"POST",
		b.baseUrl+"/pickup/operation/pickup",
		payload,
	)
	r.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, _ := client.Do(r)
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("nueva operacion pickup: %v\n%v", resp.Status, resp.Body)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println(string(body))

	return nil
}

func (b *BoxewayClient) GetELockers() (*entities.ElockerResponse, error) {
	url := b.baseUrl + fmt.Sprintf("/pickup/elockers?token=%s&with_tags=0", b.accessToken)
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var elockers entities.ElockerResponse
	err = json.Unmarshal(body, &elockers)
	if err != nil {
		return nil, err
	}

	return &elockers, nil
}

func (b *BoxewayClient) GetELockersSize(idLocker string) (*entities.ElockerSizeResponse, error) {
	url := b.baseUrl + fmt.Sprintf("/pickup/elockers/sizes?token=%s&id_elocker=%s&only_free=1", b.accessToken, idLocker)
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return nil, err
	}
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var elockers entities.ElockerSizeResponse
	err = json.Unmarshal(body, &elockers)
	if err != nil {
		return nil, err
	}

	return &elockers, nil
}
