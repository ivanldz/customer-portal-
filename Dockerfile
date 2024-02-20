FROM golang:alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o miapp
FROM scratch
COPY --from=builder /app/miapp /
EXPOSE 10804
CMD ["/miapp"]