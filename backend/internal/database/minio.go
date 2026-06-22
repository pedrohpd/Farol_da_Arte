package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func ConnectMinIO() (*minio.Client, error) {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")
	useSSLStr := os.Getenv("MINIO_USE_SSL")

	if endpoint == "" || accessKeyID == "" || secretAccessKey == "" || bucketName == "" {
		return nil, fmt.Errorf("MinIO configuration environment variables are missing")
	}

	useSSL, err := strconv.ParseBool(useSSLStr)
	if err != nil {
		useSSL = false
	}

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize MinIO client: %w", err)
	}

	ctx := context.Background()

	// Cria novo bucket.
	err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		// Verifica se já possui este bucket
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			log.Printf("MinIO: Bucket %s already exists\n", bucketName)
		} else {
			return nil, fmt.Errorf("failed to check/create MinIO bucket: %w", err)
		}
	} else {
		log.Printf("MinIO: Successfully created bucket %s\n", bucketName)
	}

	// Seta política do bucket para público somente leitura
	policy := fmt.Sprintf(`{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": {"AWS": ["*"]},
				"Action": ["s3:GetObject"],
				"Resource": ["arn:aws:s3:::%s/*"]
			}
		]
	}`, bucketName)

	err = minioClient.SetBucketPolicy(ctx, bucketName, policy)
	if err != nil {
		return nil, fmt.Errorf("failed to set MinIO bucket policy to public: %w", err)
	}
	log.Printf("MinIO: Public read policy set for bucket %s\n", bucketName)

	return minioClient, nil
}
