FROM node:16.15.0-slim as builder
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2
FROM node:16.15.0-slim
WORKDIR /app
COPY --from=builder /app/package* ./
RUN npm install
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD [ "npm", "start" ]