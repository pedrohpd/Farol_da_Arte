package models

import "time"

type Order struct {
	Code          uint      `gorm:"primaryKey;" json:"code"`
	OrderTime   time.Time   `gorm:"type:timestamptz;not null" json:"order_time"`
	UserCPF     uint        `gorm:"not null" json:"user_cpf"`
	TotalAmount float64     `gorm:"not null" json:"total_amount"`
	// Status      string      `gorm:"size:20;default:'pending';not null" json:"status"`

	// Relacionamento com o Usuário (Chave Estrangeira apontando para o CPF)
	User        User        `gorm:"foreignKey:UserCPF;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"user,omitempty"`
	// Relacionamento um-para-muitos com os itens do pedido
	Items       []OrderItem `gorm:"foreignKey:OrderID" json:"items"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   uint    `gorm:"not null" json:"order_id"`
	ProductCode uint    `gorm:"not null" json:"product_code"`
	Quantity  int     `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"not null" json:"price"`
	
	// Relacionamento com o Produto (Chave Estrangeira apontando para o Code do produto)
	Product     Product `gorm:"foreignKey:ProductCode;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"product,omitempty"`
}