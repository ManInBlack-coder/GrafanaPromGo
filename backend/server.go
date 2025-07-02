package main

import (

	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/ManInBlack-coder/backend-project/config"
	redisclient "github.com/ManInBlack-coder/backend-project/redis-client"
	"github.com/ManInBlack-coder/backend-project/simulator"
	"github.com/ManInBlack-coder/backend-project/models" 

)

// prometheus metrics for taxi simulation service
var (
	taxiUpdatesTotal = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "taxi_updates_total",
			Help: "Total number of taxi location updates published to Redis Pub/Sub",
		},
	)
	activeSimulatedTaxis = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Name: "active_simulated_taxis",
			Help: "Current number of active simulated taxis",
		},
	)
	taxiLocationUpdateDuration = prometheus.NewHistogram(
		prometheus.HistogramOpts{
			Name:    "taxi_location_update_duration_seconds",
			Help:    "Duration of a single taxi location update operation (Redis HSET and PUBLISH).",
			Buckets: prometheus.DefBuckets,
		},
	)

	taxiStatusChangeTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "taxi_status_changes_total",
			Help: "Total number of taxi status changes.",
		},
		[]string{"status"},
	)
)

func init() {
	//registers metrics to prometheus register
	prometheus.MustRegister(taxiUpdatesTotal)
	prometheus.MustRegister(activeSimulatedTaxis)
	prometheus.MustRegister(taxiLocationUpdateDuration)
	prometheus.MustRegister(taxiStatusChangeTotal)
}	


func main() {
	cfg := config.LoadConfig()
	// starting redis and simulation 
	rc, err := redisclient.NewRedisClient(cfg.RedisAddr)
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	defer rc.Close()

	metricChan := make(chan simulator.MetricUpdate, 100)

	// simConfig := &simulator.Config{
	// 	NumTaxis: cfg.NumTaxis,
	// 	SimulatorIntervalMs: cfg.SimulatorIntervalMs,
	// }

	cancelSim, err := simulator.StartTaxiSimulator(cfg, rc, metricChan)
	if err != nil {
		log.Fatalf("Failed to start taxi simulator: %v", err)
	}
	defer cancelSim()

	log.Println("Taxi simulator started. Publishing metrics to /metrics endpoint.")

	activeSimulatedTaxis.Set(float64(cfg.NumTaxis))

	// starts prometheus metrics handler
	go func() {
		http.Handle("/metrics", promhttp.Handler())
		server := &http.Server{
			Addr: ":8081",
		}
		log.Printf("Prometheus metrics endpoint listening on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Could not start Prometheus metrics server: %v", err)

		}
	}()

	// that goroutine listens metrics channels and updates metrics 
	go func() {
		for update := range metricChan {
			switch update.Type {
			case simulator.MetricTypeLocationUpdate:
				taxiUpdatesTotal.Inc()
				taxiLocationUpdateDuration.Observe(update.Value)
			case simulator.MetricTypeStatusChange:
				// Veendu, et update.Data on õiget tüüpi (DriverStatus)
				if status, ok := update.Data.(models.DriverStatus); ok {
					taxiStatusChangeTotal.WithLabelValues(string(status)).Inc()
				} else {
					log.Printf("Invalid data type for status change metric: %T", update.Data)
				}
			case simulator.MetricTypeTaxiCount:
				activeSimulatedTaxis.Set(update.Value)
			default:
				log.Printf("Unknown metric type: %s", update.Type)
			}
		}
	}()


	// elegant closing

	sigChan := make(chan os.Signal,1)
	signal.Notify(sigChan,syscall.SIGINT, syscall.SIGTERM)
	<-sigChan 

	log.Println("Shutting down gracefully...")
	close(metricChan)
	log.Println("Simulator goroutines are stopping...")
	time.Sleep(1 * time.Second)
	log.Println("Application exited.")

}
