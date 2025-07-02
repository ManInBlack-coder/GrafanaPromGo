FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /go-backend ./server.go
RUN ls -l /

FROM alpine:latest

WORKDIR /app

COPY --from=builder /go-backend /app/go-backend

EXPOSE 8081

CMD ["./go-backend"] 