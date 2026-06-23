package controllers

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

func GetProducts(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	// Avaliação preguiçosa: cancela pedidos expirados
	db.Model(&models.Order{}).
		Where("status = ? AND pix_expiration < ?", "pending_payment", time.Now()).
		Update("status", "cancelled")

	var products []models.Product

	// Busca produtos ativos que não estejam em nenhum pedido ativo ou pago
	query := `
		is_active = ? AND code NOT IN (
			SELECT oi.product_code 
			FROM order_items oi 
			JOIN orders o ON o.code = oi.order_id 
			WHERE o.status IN ('pending_payment', 'paid')
		)
	`
	if err := db.Where(query, true).Find(&products).Error; err != nil {
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

	// Avaliação preguiçosa: cancela pedidos expirados
	db.Model(&models.Order{}).
		Where("status = ? AND pix_expiration < ?", "pending_payment", time.Now()).
		Update("status", "cancelled")

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

	var imageURL string
	if req.ImageBase64 != "" {
		imageBytes, err := base64.StdEncoding.DecodeString(req.ImageBase64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Dados de imagem inválidos"})
			return
		}

		minioClient := c.MustGet("minio").(*minio.Client)
		bucketName := os.Getenv("MINIO_BUCKET_NAME")

		ext := ".jpg"
		if req.ImgType == "image/png" {
			ext = ".png"
		} else if req.ImgType == "image/gif" {
			ext = ".gif"
		} else if req.ImgType == "image/webp" {
			ext = ".webp"
		}
		fileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)

		reader := bytes.NewReader(imageBytes)
		contentType := req.ImgType
		if contentType == "" {
			contentType = "image/jpeg"
		}

		_, err = minioClient.PutObject(c.Request.Context(), bucketName, fileName, reader, int64(len(imageBytes)), minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao enviar imagem ao MinIO"})
			return
		}

		endpoint := os.Getenv("MINIO_ENDPOINT")
		useSSLStr := os.Getenv("MINIO_USE_SSL")
		schema := "http"
		if useSSLStr == "true" {
			schema = "https"
		}
		imageURL = fmt.Sprintf("%s://%s/%s/%s", schema, endpoint, bucketName, fileName)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A imagem é obrigatória para criar um novo produto"})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Type:        req.Type,
		Price:       req.Price,
		ImageURL:    imageURL,
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

		minioClient := c.MustGet("minio").(*minio.Client)
		bucketName := os.Getenv("MINIO_BUCKET_NAME")

		ext := ".jpg"
		if req.ImgType == "image/png" {
			ext = ".png"
		} else if req.ImgType == "image/gif" {
			ext = ".gif"
		} else if req.ImgType == "image/webp" {
			ext = ".webp"
		}
		fileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)

		reader := bytes.NewReader(imageBytes)
		contentType := req.ImgType
		if contentType == "" {
			contentType = "image/jpeg"
		}

		_, err = minioClient.PutObject(c.Request.Context(), bucketName, fileName, reader, int64(len(imageBytes)), minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao enviar imagem ao MinIO"})
			return
		}

		endpoint := os.Getenv("MINIO_ENDPOINT")
		useSSLStr := os.Getenv("MINIO_USE_SSL")
		schema := "http"
		if useSSLStr == "true" {
			schema = "https"
		}
		product.ImageURL = fmt.Sprintf("%s://%s/%s/%s", schema, endpoint, bucketName, fileName)
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
