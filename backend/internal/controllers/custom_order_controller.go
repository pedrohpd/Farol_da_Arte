package controllers

import (
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

	var imageURL string
	file, header, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()

		minioClient := c.MustGet("minio").(*minio.Client)
		bucketName := os.Getenv("MINIO_BUCKET_NAME")

		ext := ".jpg"
		if len(header.Filename) > 0 {
			contentType := header.Header.Get("Content-Type")
			if contentType == "image/png" {
				ext = ".png"
			} else if contentType == "image/gif" {
				ext = ".gif"
			} else if contentType == "image/webp" {
				ext = ".webp"
			}
		}
		fileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)

		contentType := header.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "application/octet-stream"
		}

		_, err = minioClient.PutObject(c.Request.Context(), bucketName, fileName, file, header.Size, minio.PutObjectOptions{
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
	} else if err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao ler arquivo enviado"})
		return
	}

	customOrder := models.CustomOrder{
		OrderTime: time.Now(),
		UserID:    userID,
		Model:     model,
		Details:   description,
		ImageURL:  imageURL,
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
