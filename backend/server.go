package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"

    "github.com/gorilla/mux"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

// defining prometheus metrics 

var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "route", "code"},
	)

	// requests histogram to track request duration
	httpRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name: "http_request_duration_seconds",
			Help: "Duration of HTTP requests in seconds",
			Buckets: prometheus.DefBuckets, // default buckets  
		},
		[]string{"method", "route"},
	)
)

func init() {
	// Register the metrics to Prometheus registry
	prometheus.MustRegister(httpRequestsTotal)
	prometheus.MustRegister(httpRequestDuration)
}



type User struct {
	ID string `json:"id"`
	Username string `json:"username"`
	Email string `json:"email"`
}

var users []User = []User{
	{ID: "1", Username: "john_doe", Email: "john@gmail.com"},
}

func main() {
 // Initialize a new router
 router := mux.NewRouter()

 // add Prometheus metric endpoint 
 router.Handle("/metrics", promhttp.Handler())

 // added metric collect middleware
 router.HandleFunc("/users", trackMetrics(getUsers, "/users", "GET")).Methods("GET")
 router.HandleFunc("/users", trackMetrics(createUser, "/users", "GET")).Methods("POST")


 log.Fatal(http.ListenAndServe(":8080", router))
}

func trackMetrics(handler http.HandlerFunc, path, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now() // reqeust start time
		lw := &loggingResponseWriter{ResponseWriter: w} // custom response writer to capture status code

		handler.ServeHTTP(lw,r) // start handling the request
		duration := time.Since(start).Seconds() // calculate duration
		httpRequestDuration.WithLabelValues(path, method,).Observe(duration)

		httpRequestsTotal.WithLabelValues(method, path, http.StatusText(lw.statusCode)).Inc()
	}
}

// improves getting the status code back of the response
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func(lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code 
	lrw.ResponseWriter.WriteHeader(code)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(users)

	
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var newUser User
	_ = json.NewDecoder(r.Body).Decode(&newUser)
	users = append(users, newUser)
	json.NewEncoder(w).Encode(newUser)
}

