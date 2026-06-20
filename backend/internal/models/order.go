package models

import "time"

type Order struct {
	Code           uint      `gorm:"primaryKey;autoIncrement" json:"code"`
	OrderTime      time.Time `gorm:"type:timestamptz;not null" json:"order_time"`
	UserID         uint      `gorm:"not null" json:"user_id"`
	TotalAmount    float64   `gorm:"not null" json:"total_amount"`
	Status         string    `gorm:"size:50;not null;default:'pending_payment'" json:"status"`
	PaymentMethod  string    `gorm:"size:50;not null;default:'pix'" json:"payment_method"`
	PixQRCode      string    `gorm:"type:text" json:"pix_qrcode"`
	PixExpiration  time.Time `gorm:"type:timestamptz" json:"pix_expiration"`

	User  User        `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"user,omitempty"`
	Items []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

type OrderItem struct {
	ID          uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID     uint    `gorm:"not null" json:"order_id"`
	ProductCode uint    `gorm:"not null" json:"product_code"`
	Quantity    int     `gorm:"not null" json:"quantity"`
	Price       float64 `gorm:"not null" json:"price"`

	Product Product `gorm:"foreignKey:ProductCode;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"product,omitempty"`
}
