FROM golang:1.19
WORKDIR /app
COPY . .
RUN go build
EXPOSE 10800

CMD ["./trigger-retiro-sucursal"] 
