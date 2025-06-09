# Base image
FROM node:18

# Thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình và cài dependencies
COPY package*.json ./
RUN npm install

# Cài PM2 toàn cục
RUN npm install -g pm2

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng
EXPOSE 9090

# Chạy app bằng PM2 runtime (đúng chuẩn cho Docker)
CMD ["pm2-runtime", "index.js"]