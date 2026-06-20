package models

import "gorm.io/gorm"

type User struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name           string `gorm:"size:100;not null" json:"name"`
	Email          string `gorm:"size:150;unique;not null" json:"email"`
	PasswordHash   string `gorm:"size:255;not null"`
	State          string `gorm:"size:2;not null" json:"state"`
	City           string `gorm:"size:50;not null" json:"city"`
	Street         string `gorm:"size:150;not null" json:"street"`
	Number         int    `gorm:"not null" json:"number"`
	AdditionalInfo string `gorm:"size:200;not null" json:"additional_info"`
	CEP            string `gorm:"size:10;not null" json:"cep"`
	CPF            string `gorm:"size:14;not null;unique" json:"cpf"`
	IsAdmin        bool           `gorm:"default:false" json:"is_admin"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type UserRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password" binding:"required,min=8"`
	State          string `json:"state" binding:"required"`
	City           string `json:"city" binding:"required"`
	Street         string `json:"street" binding:"required"`
	Number         int    `json:"number" binding:"required"`
	AdditionalInfo string `json:"additional_info" binding:"required"`
	CEP            string `json:"cep" binding:"required"`
	CPF            string `json:"cpf" binding:"required"`
}

type ProfileUpdateRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password"` // optional
	State          string `json:"state" binding:"required"`
	City           string `json:"city" binding:"required"`
	Street         string `json:"street" binding:"required"`
	Number         int    `json:"number" binding:"required"`
	AdditionalInfo string `json:"additional_info"` // optional
	CEP            string `json:"cep" binding:"required"`
	CPF            string `json:"cpf" binding:"required"`
}

type UserLogado struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	State          string `json:"state"`
	City           string `json:"city"`
	Street         string `json:"street"`
	Number         int    `json:"number"`
	AdditionalInfo string `json:"additional_info"`
	CEP            string `json:"cep"`
	CPF            string `json:"cpf"`
	IsAdmin        bool   `json:"is_admin"`
}
