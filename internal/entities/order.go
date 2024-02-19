package entities

import (
	"encoding/json"
	"time"
)

type OrderDetails struct {
	OrderID           string            `json:"orderId"`
	Status            string            `json:"status"`
	Value             int               `json:"value"`
	CreationDate      string            `json:"creationDate"`
	LastChange        string            `json:"lastChange"`
	Items             []Item            `json:"items"`
	ClientData        ClientData        `json:"clientProfileData"`
	ShippingData      ShippingData      `json:"shippingData"`
	Sellers           []Seller          `json:"sellers"`
	TrackingHints     string            `json:"trackingHints"`
	ItemMetadata      *ItemMetadata     `json:"itemMetadata,omitempty"`
	CustomComments    string            `json:"customComments"`
	PackageAttachment PackageAttachment `json:"packageAttachment"`
	PaymentData       PaymentData       `json:"paymentData"`
}

type Item struct {
	ID        string `json:"id"`
	ListPrice int    `json:"listPrice"`
	CostPrice int    `json:"price"`
	Quantity  int    `json:"quantity"`
	Name      string `json:"Name"`
	SkuName   string `json:"SkuName"`
	ProductID string `json:"ProductId"`
	RefID     string `json:"RefId"`
	Ean       string `json:"Ean"`
}

type ClientData struct {
	ID                 string `json:"id"`
	Email              string `json:"email"`
	FirstName          string `json:"firstName"`
	LastName           string `json:"lastName"`
	DocumentType       string `json:"documentType"`
	Document           string `json:"document"`
	Phone              string `json:"phone"`
	CorporateName      string `json:"corporateName"`
	TradeName          string `json:"tradeName"`
	CorporateDocument  string `json:"corporateDocument"`
	StateInscription   string `json:"stateInscription"`
	CorporatePhone     string `json:"corporatePhone"`
	IsCorporate        bool   `json:"isCorporate"`
	UserProfileID      string `json:"userProfileId"`
	UserProfileVersion string `json:"userProfileVersion"`
	CustomerClass      string `json:"customerClass"`
}

type ShippingData struct {
	ID      string `json:"id"`
	Address struct {
		AddressId    string `json:"addressId"`
		AddressType  string `json:"addressType"`
		ReceiverName string `json:"receiverName"`
		PostalCode   string `json:"postalCode"`
		City         string `json:"city"`
		State        string `json:"state"`
		Country      string `json:"country"`
		Street       string `json:"street"`
		Number       string `json:"number"`
		Neighborhood string `json:"neighborhood"`
	} `json:"address"`
	LogisticsInfo []LogisticsInfo `json:"logisticsInfo"`
}

type LogisticsInfo struct {
	ItemIndex            int    `json:"itemIndex"`
	SelectedSLA          string `json:"selectedSla"`
	LockTTL              string `json:"lockTTL"`
	Price                int    `json:"price"`
	ListPrice            int    `json:"listPrice"`
	SellingPrice         int    `json:"sellingPrice"`
	DeliveryCompany      string `json:"deliveryCompany"`
	ShippingEstimate     string `json:"shippingEstimate"`
	ShippingEstimateDate string `json:"shippingEstimateDate"`
	Slas                 []SLA  `json:"slas"`
}

type SLA struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	DeliveryChannel string `json:"deliveryChannel"`
	PickupStoreInfo struct {
		AdditionalInfo string  `json:"additionalInfo"`
		Address        Address `json:"address"`
		DockID         string  `json:"dockId"`
		FriendlyName   string  `json:"friendlyName"`
		IsPickupStore  bool    `json:"isPickupStore"`
	} `json:"pickupStoreInfo"`
}

type Address struct {
	Street string `json:"street"`
	Number string `json:"number"`
}

type Seller struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	Logo                string `json:"logo"`
	FulfillmentEndpoint string `json:"fulfillmentEndpoint"`
}

type ItemMetadata struct {
	Items []struct {
		ID        string `json:"Id"`
		Name      string `json:"Name"`
		SkuName   string `json:"SkuName"`
		ProductID string `json:"ProductId"`
		RefID     string `json:"RefId"`
		Ean       string `json:"Ean"`
	} `json:"Items"`
}

type BodyInvoiceVtex struct {
	IssuanceDate  string  `json:"issuanceDate"`
	InvoiceNumber string  `json:"invoiceNumber"`
	InvoiceValue  float64 `json:"invoiceValue"`
	InvoiceURL    string  `json:"invoiceURL"`
}

type PackageAttachment struct {
	Packages []Package `json:"packages"`
}

type Package struct {
	Items            []ItemPackage   `json:"items"`
	Courier          string          `json:"courier"`
	InvoiceNumber    string          `json:"invoiceNumber"`
	InvoiceValue     int             `json:"invoiceValue"`
	InvoiceUrl       string          `json:"invoiceUrl"`
	IssuanceDate     time.Time       `json:"issuanceDate"`
	TrackingNumber   string          `json:"trackingNumber"`
	InvoiceKey       string          `json:"invoiceKey"`
	TrackingUrl      string          `json:"trackingUrl"`
	EmbeddedInvoice  string          `json:"embeddedInvoice"`
	Type             string          `json:"type"`
	CourierStatus    string          `json:"courierStatus"`
	Cfop             string          `json:"cfop"`
	Restitutions     json.RawMessage `json:"restitutions"`
	EnableInferItems interface{}     `json:"EnableInferItems"`
}

type Resolution struct {
	Refund struct {
		Value int `json:"value"`
	} `json:"refund,omitempty"`
}

type ItemPackage struct {
	ItemIndex      int         `json:"itemIndex"`
	Quantity       int         `json:"quantity"`
	Price          int         `json:"price"`
	Description    interface{} `json:"description"`
	UnitMultiplier float64     `json:"unitMultiplier"`
}

type PaymentData struct {
	Transactions []Transaction `json:"transactions"`
}

type Transaction struct {
	Payments []Payment `json:"payments"`
}

type Payment struct {
	PaymentSystem     string `json:"paymentSystem"`
	PaymentSystemName string `json:"paymentSystemName"`
	Group             string `json:"group"`
}
