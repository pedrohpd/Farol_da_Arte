package controllers

import (
	"net/http"

	"backend/internal/models"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var req models.UserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Já existe um usuário com este email"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao processar senha"})
		return
	}

	newUser := models.User{
		Name:           req.Name,
		Email:          req.Email,
		PasswordHash:   hashedPassword,
		State:          req.State,
		City:           req.City,
		Street:         req.Street,
		Number:         req.Number,
		AdditionalInfo: req.AdditionalInfo,
		CEP:            req.CEP,
		CPF:            req.CPF,
		IsAdmin:        req.Email == "admin@farol.com",
	}

	if err := db.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar usuário"})
		return
	}

	// Generate token for auto-login
	token, err := utils.GenerateToken(newUser.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Usuário criado, mas falhou ao gerar token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuário registrado com sucesso",
		"token":   token,
		"user": gin.H{
			"id":              newUser.ID,
			"name":            newUser.Name,
			"email":           newUser.Email,
			"is_admin":        newUser.IsAdmin,
			"state":           newUser.State,
			"city":            newUser.City,
			"street":          newUser.Street,
			"number":          newUser.Number,
			"additional_info": newUser.AdditionalInfo,
			"cep":             newUser.CEP,
			"cpf":             newUser.CPF,
		},
	})
}

func Login(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email ou senha incorretos"})
		return
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email ou senha incorretos"})
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login realizado com sucesso",
		"token":   token,
		"user": gin.H{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"is_admin":        user.IsAdmin,
			"state":           user.State,
			"city":            user.City,
			"street":          user.Street,
			"number":          user.Number,
			"additional_info": user.AdditionalInfo,
			"cep":             user.CEP,
			"cpf":             user.CPF,
		},
	})
}

func UpdateProfile(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autorizado"})
		return
	}

	var req models.ProfileUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	// Update fields
	user.Name = req.Name
	user.Email = req.Email
	user.State = req.State
	user.City = req.City
	user.Street = req.Street
	user.Number = req.Number
	user.CEP = req.CEP
	user.CPF = req.CPF
	user.AdditionalInfo = req.AdditionalInfo

	// Update password if provided
	if req.Password != "" {
		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao processar nova senha"})
			return
		}
		user.PasswordHash = hashedPassword
	}

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao atualizar perfil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Perfil atualizado com sucesso",
		"user": gin.H{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"is_admin":        user.IsAdmin,
			"state":           user.State,
			"city":            user.City,
			"street":          user.Street,
			"number":          user.Number,
			"additional_info": user.AdditionalInfo,
			"cep":             user.CEP,
			"cpf":             user.CPF,
		},
	})
}

func DeleteProfile(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autorizado"})
		return
	}

	// Soft delete the user
	if err := db.Delete(&models.User{}, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao excluir perfil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Perfil excluído com sucesso"})
}
