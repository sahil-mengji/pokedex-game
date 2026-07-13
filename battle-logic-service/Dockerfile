# Use an official Python slim image.
FROM python:3.9-slim

# Set working directory.
WORKDIR /app

# Copy the current directory contents into the container at /app.
COPY . /app

# Set the working directory to the app subdirectory.
WORKDIR /app/app

# Install any needed packages specified in requirements.txt.
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port 8000.
EXPOSE 8000

# Run the application.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
