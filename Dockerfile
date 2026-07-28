# Menggunakan image Node.js
FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh source code frontend
COPY . .

# Ekspos port Vite (biasanya 5173)
EXPOSE 5173

# Jalankan server development Vite (karena di package.json sudah ada --host)
CMD ["npm", "run", "dev"]
