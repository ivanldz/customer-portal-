package entities

type HookData struct {
	OrderId    string `json:"OrderId"`
	State      string `json:"State"`
	HookConfig string `json:"hookConfig"`
}
