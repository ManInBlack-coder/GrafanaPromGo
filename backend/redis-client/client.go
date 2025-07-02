package redisclient

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
    "github.com/ManInBlack-coder/backend-project/models" // See on õige imporditee!
)

const (
	TaxiUpdateChannel       = "taxi_updates"
	DriverLocationKeyPrefix = "driver:"
)

type RedisClient struct {
	client *redis.Client
	ctx    context.Context
}

// creates and returns new RedisClient
func NewRedisClient(addr string) (*RedisClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "",
		DB:       0,
	})
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to connect redis: %v", err)
	}
	log.Println("Connected succesfully to Redis")
	return &RedisClient{client: rdb, ctx: context.Background()}, nil
}

// saves drivers location to redis
func (rc *RedisClient) SaveDriverLocation(driver *models.Driver) error {
	key := DriverLocationKeyPrefix + driver.ID + ":location"
	_, err := rc.client.HSet(rc.ctx, key, driver.ToRedisHash()).Result()
	if err != nil {
		return fmt.Errorf("failed to save driver location to Redis: %w", err)
	}

	return nil
}

// publishes driver location updates to Pub/Sub channel
func (rc *RedisClient) PublishDriverUpdate(driver *models.Driver) error {
	_, err := rc.client.Publish(rc.ctx, TaxiUpdateChannel, driver.ToJSONString()).Result()
	if err != nil {
		return fmt.Errorf("Failed to publish driver update: %v", err)
	}
	return nil
}

func (rc *RedisClient) Close() error {
	return rc.client.Close()
}
