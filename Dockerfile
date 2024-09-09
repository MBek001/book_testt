FROM python:3.11-alpine

# Install necessary packages
RUN apk add --no-cache bash

# Create and set working directory
RUN mkdir -p /static/images
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir celery

# Copy application code
COPY . .

# Set PYTHONPATH to ensure Python can find the modules
ENV PYTHONPATH=/app

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
