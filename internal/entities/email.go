package entities

type Email struct {
	Fullname      string `json:"fullname"`
	PhoneNumber   string `json:"phone"`
	Dni           string `json:"dni"`
	PaymentMethod string `json:"payment_method"`
	OrderId       string `json:"order_id"`
	EmailStore    string `json:"email_store"`
	ProductsList  string `json:"products_list"` // Almacena la lista de productos en un formato apto para el mail
}
