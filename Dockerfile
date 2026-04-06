FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y \
    blender \
    python3 \
    python3-pip

WORKDIR /app
COPY . .

RUN pip3 install -r requirements.txt

CMD ["python3", "handler.py"]
