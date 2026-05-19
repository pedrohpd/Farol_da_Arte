package models

type Product struct {
	Code		 	uint    `gorm:"primaryKey;not null" json:"code"`
	Name        	string  `gorm:"size:50;not null" json:"name"`
	Description     string  `gorm:"size:150;not null" json:"description"`
	Type		 	string  `gorm:"size:25;not null" json:"type"`
	Price			float64	`gorm:"not null" json:"price"`
	ImgType  		string 	`json:"mime_type"`
	ImageData 		[]byte 	`gorm:"type:bytea"`
}

type ProductRequest struct {
	Name        	string  `json:"name" binding:"required"`
	Description     string  `json:"description" binding:"required"`
	Type		 	string  `json:"type" binding:"required"`
	Price			float64	`json:"price" binding:"required"`
	ImgType    		string 	`json:"img_type" binding:"required"`
	ImageBase64 	string 	`json:"image_base64" binding:"required"`
}