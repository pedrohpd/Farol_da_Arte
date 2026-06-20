package controllers

import (
	"net/http"
	"time"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateOrderRequest struct {
	Items []struct {
		ProductCode uint `json:"product_code" binding:"required"`
		Quantity    int  `json:"quantity" binding:"required,min=1"`
	} `json:"items" binding:"required,min=1"`
}

func CreateOrder(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID := c.MustGet("user_id").(uint)

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var totalAmount float64
	var orderItems []models.OrderItem

	for _, item := range req.Items {
		var product models.Product
		if err := db.First(&product, item.ProductCode).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Produto não encontrado"})
			return
		}

		price := product.Price
		totalAmount += price * float64(item.Quantity)

		orderItems = append(orderItems, models.OrderItem{
			ProductCode: item.ProductCode,
			Quantity:    item.Quantity,
			Price:       price,
		})
	}

	order := models.Order{
		OrderTime:     time.Now(),
		UserID:        userID,
		TotalAmount:   totalAmount,
		Items:         orderItems,
		Status:        "pending_payment",
		PaymentMethod: "pix",
		PixQRCode:     "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266554400005204000053039865802BR5913Farol da Arte6009Sao Paulo62070503***63041A2B", // Mock estático
		PixExpiration: time.Now().Add(30 * time.Minute),
	}

	if err := db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar pedido"})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func GetUserOrders(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	userID := c.MustGet("user_id").(uint)

	var orders []models.Order
	if err := db.Preload("Items").Preload("Items.Product").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar pedidos"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	var orders []models.Order
	if err := db.Preload("Items").Preload("Items.Product").Preload("User").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar todos os pedidos"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func UpdateOrderStatus(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	orderID := c.Param("id")

	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var order models.Order
	if err := db.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pedido não encontrado"})
		return
	}

	order.Status = req.Status
	if err := db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao atualizar status do pedido"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Status atualizado com sucesso",
		"order":   order,
	})
}
