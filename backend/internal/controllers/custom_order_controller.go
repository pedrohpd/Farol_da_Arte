package controllers

import (
	"io"
	"net/http"
	"time"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateCustomOrder(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID := c.MustGet("user_id").(uint)

	// Max 5MB file size
	err := c.Request.ParseMultipartForm(5 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Arquivo muito grande ou formulário inválido"})
		return
	}

	model := c.PostForm("model")
	description := c.PostForm("description")

	if model == "" || description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Modelo e descrição são obrigatórios"})
		return
	}

	var imageData []byte
	var imgType string

	file, header, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()
		imageData, err = io.ReadAll(file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao ler imagem"})
			return
		}
		imgType = header.Header.Get("Content-Type")
	} else if err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao ler arquivo enviado"})
		return
	}

	customOrder := models.CustomOrder{
		OrderTime: time.Now(),
		UserID:    userID,
		Model:     model,
		Details:   description,
		ImgType:   imgType,
		ImageData: imageData,
		Price:     0,
	}

	if err := db.Create(&customOrder).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar pedido sob medida"})
		return
	}

	c.JSON(http.StatusCreated, customOrder)
}

func GetUserCustomOrders(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID := c.MustGet("user_id").(uint)

	var customOrders []models.CustomOrder
	if err := db.Where("user_id = ?", userID).Find(&customOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar pedidos sob medida"})
		return
	}

	c.JSON(http.StatusOK, customOrders)
}

func GetAllCustomOrders(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	var customOrders []models.CustomOrder
	if err := db.Preload("User").Find(&customOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar todos os pedidos sob medida"})
		return
	}

	c.JSON(http.StatusOK, customOrders)
}
