package models

import "time"

type CustomOrder struct {
	Code        uint      	`gorm:"primaryKey;"`
	OrderTime   time.Time   `gorm:"type:timestamptz;not null"`
	UserCPF     uint        `gorm:"not null"`
	Model		string		`gorm:"size:50;not null"`
	Details		string		`gorm:"size:150;not null"`
	ImgType  	string 		`json:"mime_type"`
	ImageData 	[]byte 		`gorm:"type:bytea"`
	Price		float64		`gorm:"not null"`
	// Status      string      `gorm:"size:20;default:'pending';not null" json:"status"`

	// Relacionamento com o Usuário (Chave Estrangeira apontando para o CPF)
	User        User        `gorm:"foreignKey:UserCPF;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}

type CreateCustomOrderRequest struct {
	OrderTime   time.Time   `json:"order_time" binding:"required"`
	UserCPF     uint        `json:"user_cpf" binding:"required"`
	Model		string		`json:"model" binding:"required"`
	Details		string		`json:"description" binding:"required"`
	ImgType  	string 		`json:"mime_type"`
	ImageData 	[]byte 		`gorm:"type:bytea"`
}