go install go.k6.io/xk6/cmd/xk6@latest

cd bin && xk6 build --with github.com/grafana/xk6-faker@latest
