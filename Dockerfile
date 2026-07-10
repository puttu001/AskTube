# Combined image: builds the frontend, then serves it from the backend.
# produces a single portable image on one port instead of two containers.

FROM node:20-slim AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .
COPY --from=client-build /client/dist ./static

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
