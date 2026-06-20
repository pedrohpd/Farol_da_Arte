package models

import "time"

type CustomOrder struct {
	Code      uint      `gorm:"primaryKey;autoIncrement"`
	OrderTime time.Time `gorm:"type:timestamptz;not null"`
	UserID    uint      `gorm:"not null"`
	Model     string    `gorm:"size:50;not null"`
	Details   string    `gorm:"size:150;not null"`
	ImgType   string    `json:"img_type"`
	ImageData []byte    `gorm:"type:bytea" json:"image_data"`
	Price     float64   `gorm:"not null"`

	User User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}

type CreateCustomOrderRequest struct {
	OrderTime time.Time `json:"order_time" binding:"required"`
	Model     string    `json:"model" binding:"required"`
	Details   string    `json:"description" binding:"required"`
	ImgType   string    `json:"img_type"`
}
