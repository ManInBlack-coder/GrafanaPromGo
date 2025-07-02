package simulator

import (
	"context"
	"log"
	"strconv"

	"github.com/ManInBlack-coder/backend-project/config"
	redisclient "github.com/ManInBlack-coder/backend-project/redis-client"
)

type Config struct {
	SimulatorIntervalMs int
	NumTaxis int
}

type MetricUpdate struct {
	Type MetricType
	Value float64
	Data interface{}
}

type MetricType string

const ( 
	MetricTypeLocationUpdate MetricType = "location_update"
	MetricTypeStatusChange MetricType = "status_change"
	MetricTypeTaxiCount MetricType = "taxi_count"
)

// käivitab kõik simulaatorid 
func StartTaxiSimulator(cfg *config.Config, rc *redisclient.RedisClient, metricsChan chan <- MetricUpdate ) (context.CancelFunc, error) {

	ctx, cancel := context.WithCancel(context.Background())

	for i := 1; i <= cfg.NumTaxis; i++ {
		driverID := strconv.Itoa(i)
		// Pass cfg directly if newTaxiDriver accepts *simulator.Config
		driver := newTaxiDriver(driverID, rc, cfg, metricsChan)
		go driver.StartDriving(ctx) //starts drivers goroutines
		log.Printf("Started simulation for driver %s", driverID)
	} 
	return cancel, nil 

}