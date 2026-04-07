FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=80

EXPOSE 80

CMD ["sh", "-c", "uvicorn handler:app --host 0.0.0.0 --port ${PORT:-80}"]
