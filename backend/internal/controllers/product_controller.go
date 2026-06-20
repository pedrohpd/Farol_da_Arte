package controllers

import (
	"encoding/base64"
	"net/http"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProducts(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var products []models.Product

	if err := db.Where("is_active = ?", true).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar produtos"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetAllProductsAdmin(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var products []models.Product

	if err := db.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar produtos"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var req models.ProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var imageBytes []byte
	if req.ImageBase64 != "" {
		var err error
		imageBytes, err = base64.StdEncoding.DecodeString(req.ImageBase64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de imagem inválidos"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A imagem é obrigatória para criar um novo produto"})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Type:        req.Type,
		Price:       req.Price,
		ImgType:     req.ImgType,
		ImageData:   imageBytes,
	}

	product.IsActive = true // active by default

	if err := db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar produto"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
		return
	}

	var req models.ProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.Name = req.Name
	product.Description = req.Description
	product.Type = req.Type
	product.Price = req.Price

	if req.ImageBase64 != "" {
		imageBytes, err := base64.StdEncoding.DecodeString(req.ImageBase64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de imagem inválidos"})
			return
		}
		product.ImageData = imageBytes
		product.ImgType = req.ImgType
	}

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao atualizar produto"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func ToggleProductVisibility(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	id := c.Param("id")

	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
		return
	}

	product.IsActive = !product.IsActive

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao atualizar visibilidade do produto"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Visibilidade do produto alterada com sucesso", "is_active": product.IsActive})
}
