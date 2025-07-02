package config

import (
	"log"
	"os"
	"strconv"
)

type Config struct {
	RedisAddr string
	SimulatorIntervalMs int
	NumTaxis int 
}


func LoadConfig() *Config {
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "redis:6379" // docker address
	}

	simIntervalStr := os.Getenv("SIM_INTERVALS_MS")
	simInterval, err := strconv.Atoi(simIntervalStr)
	if err != nil || simInterval <= 0 {
		simInterval = 3000
		log.Printf("interval ms not set or invalid, using default")
	} 

	numTaxisStr := os.Getenv("NUM_TAXIS")
	numTaxis, err := strconv.Atoi(numTaxisStr)
	if err != nil || numTaxis <= 0 {
		numTaxis = 10
		log.Printf("using default because of error ")
	}

	return &Config{
		RedisAddr: redisAddr,
		SimulatorIntervalMs: simInterval,
		NumTaxis: numTaxis,
	}
}