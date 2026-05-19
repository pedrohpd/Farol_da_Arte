package models

type User struct {
	CPF		 		uint    `gorm:"primaryKey;not null" json:"cpf"`
	Name        	string  `gorm:"size:100;not null" json:"name"`
	Email        	string  `gorm:"size:150;unique;not null" json:"email"`
	PasswordHash	string  `gorm:"size:255;not null"`
	State			string	`gorm:"size:2;not null" json:"state"`				
	City			string	`gorm:"size:50;not null" json:"city"`
	Street			string	`gorm:"size:150;not null" json:"street"`
	Number			int		`gorm:"not null" json:"number"`
	AdditionalInfo	string	`gorm:"size:200;not null" json:"additional_info"`
}

type UserRequest struct {
	CPF				int		`json:"cpf" binding:"required"`
	Name     		string 	`json:"name" binding:"required"`
	Email    		string 	`json:"email" binding:"required,email"`
	Password		string 	`json:"password" binding:"required,min=8"`
	State			string	`json:"state" binding:"required"`				
	City			string	`json:"city" binding:"required"`
	Street			string	`json:"street" binding:"required"`
	Number			int		`json:"number" binding:"required"`
	AdditionalInfo	string	`json:"additional_info" binding:"required"`
}

type UserLogado struct {
	CPF				int		`json:"cpf"`
	Name     		string 	`json:"name" binding:"required"`
	Email    		string 	`json:"email" binding:"required,email"`
	State			string	`json:"state" binding:"required"`				
	City			string	`json:"city" binding:"required"`
	Street			string	`json:"street" binding:"required"`
	Number			int		`json:"number" binding:"required"`
	AdditionalInfo	string	`json:"additional_info" binding:"required"`
}

