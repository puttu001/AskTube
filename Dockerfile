# ==========================================
# 1. Build the Frontend
# ==========================================
FROM node:20-slim AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ==========================================
# 2. Build and Run the Backend
# ==========================================

FROM python:3.12-slim
WORKDIR /app
COPY server/requirements.txt ./server/
RUN pip install --no-cache-dir -r ./server/requirements.txt
COPY server/ ./server/
COPY --from=client-build /client/dist ./static

EXPOSE 8000

CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
