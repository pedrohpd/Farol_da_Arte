package api

import (
	"backend/internal/controllers"
	"backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, minioClient *minio.Client) *gin.Engine {
	r := gin.Default()

	// Configuração CORS para permitir frontend React
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Inserção de DB e MinIO no contexto para handlers
	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Set("minio", minioClient)
		c.Next()
	})

	// API Routes
	api := r.Group("/api")
	{
		// Auth
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		// Public Products Catalog
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.RequireAuth())
		{
			// Profile Routes
			protected.PUT("/profile", controllers.UpdateProfile)
			protected.DELETE("/profile", controllers.DeleteProfile)

			// Admin Routes
			admin := protected.Group("/")
			admin.Use(middleware.RequireAdmin())
			{
				admin.GET("/admin/products", controllers.GetAllProductsAdmin)
				admin.POST("/products", controllers.CreateProduct)
				admin.PUT("/products/:id", controllers.UpdateProduct)
				admin.PATCH("/products/:id/toggle", controllers.ToggleProductVisibility)

				admin.GET("/admin/orders", controllers.GetAllOrders)
				admin.PATCH("/admin/orders/:id/status", controllers.UpdateOrderStatus)

				admin.GET("/admin/custom-orders", controllers.GetAllCustomOrders)
			}

			// Orders
			protected.POST("/orders", controllers.CreateOrder)
			protected.GET("/orders", controllers.GetUserOrders)

			// Custom Orders
			protected.POST("/custom-orders", controllers.CreateCustomOrder)
			protected.GET("/custom-orders", controllers.GetUserCustomOrders)
		}
	}

	return r
}
