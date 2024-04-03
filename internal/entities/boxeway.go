package entities

type LoginResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Content string `json:"content"`
}

type OperationPickup struct {
	LockerId          string
	LockerIdSize      int
	ReceiptName       string
	Email             string
	Phone             string
	ExternalReference string
}

type Elocker struct {
	ID                 string `json:"id_elocker"`
	Name               string `json:"name"`
	Address            string `json:"address"`
	HoursOfOperation   string `json:"hours_of_operation"`
	Instructions       string `json:"instructions"`
	Latitude           string `json:"latitude"`
	Longitude          string `json:"longitude"`
	AcceptsBox2Box     string `json:"accepts_box2box"`
	LastSuccessfulSync string `json:"last_successful_sync"`
	IDConsorcio        string `json:"id_consorcio"`
}

type ElockerContent struct {
	Elockers []Elocker `json:"elockers"`
}

type LockerSize struct {
	ID                int    `json:"id_locker_size"`
	Name              string `json:"name"`
	Total             int    `json:"total"`
	Free              int    `json:"free"`
	RentedLockers     int    `json:"rented_lockers"`
	FreeRentedLockers int    `json:"free_rented_lockers"`
	IDElocker         int    `json:"id_elocker"`
	ElockerName       string `json:"elocker_name"`
}

type ElockerResponse struct {
	Code    int            `json:"code"`
	Message string         `json:"message"`
	Content ElockerContent `json:"content"`
}

type ElockerSizeResponse struct {
	Code    int          `json:"code"`
	Message string       `json:"message"`
	Content []LockerSize `json:"content"`
}
