package simulator

import (
	"context"
	"log"
	"time"

	"github.com/ManInBlack-coder/backend-project/models"
	redisclient "github.com/ManInBlack-coder/backend-project/redis-client"
	"github.com/ManInBlack-coder/backend-project/utils"
	"github.com/ManInBlack-coder/backend-project/config"

)


type TaxiDriver struct {
	Driver *models.Driver
	Redis *redisclient.RedisClient
	Config *config.Config
	metricsChan chan <-MetricUpdate
}

// newTaxiDriver creates new TaxiDriver exemplar 
func newTaxiDriver(id string, rc *redisclient.RedisClient, cfg *config.Config, metricsChan chan <- MetricUpdate) *TaxiDriver {
	lat,lon := utils.GenerateRandomCoordinates()
	
	return &TaxiDriver{
		Driver: &models.Driver{
			ID: id,
			Latitude: lat,
			Longitude: lon,
			Status: models.DriveStatusAvailable,
			VechileID: "V" + id,
		},
		Redis: rc,
		Config: cfg,
		metricsChan: metricsChan,
	}
}

func (td *TaxiDriver) StartDriving(ctx context.Context) {
	ticker := time.NewTicker(time.Duration(td.Config.SimulatorIntervalMs) * time.Millisecond)
	defer ticker.Stop()
	// sends first status changes
	td.metricsChan <- MetricUpdate{Type:MetricTypeStatusChange, Data: td.Driver.Status}

	for {
		select {
		case <-ctx.Done():
			log.Printf("Driver %s simulation stopped ", td.Driver.ID)
			return
		case <-ticker.C:
			start := time.Now()
			//updates location 
			td.Driver.Latitude, td.Driver.Longitude = utils.MoveTowardsRandomPoint(
				td.Driver.Latitude, td.Driver.Longitude,
				0.005,
				float64(td.Config.SimulatorIntervalMs)/1000.0,
			)

			err := td.Redis.SaveDriverLocation(td.Driver)
			if err != nil {
				log.Printf("Error saving driver %s location: %v", td.Driver.ID, err)
			}
			err = td.Redis.PublishDriverUpdate(td.Driver)
			if err != nil {
				log.Printf("Error publishing driver %s update: %v", td.Driver.ID, err)
			} 

			//sends metric updates 
			duration := time.Since(start).Seconds()
			td.metricsChan <- MetricUpdate{Type: MetricTypeLocationUpdate, Value: duration}
		}
	}
}