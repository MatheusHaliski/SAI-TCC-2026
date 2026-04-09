FROM runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000 \
    WORKER_APP_DIR=/app

WORKDIR /app

COPY blender-worker/requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

COPY blender-worker/handler.py /app/handler.py
COPY blender_common /app/blender_common
COPY scripts/runpod-worker-bootstrap.sh /usr/local/bin/runpod-worker-bootstrap.sh

RUN chmod +x /usr/local/bin/runpod-worker-bootstrap.sh

EXPOSE 8000

CMD ["/usr/local/bin/runpod-worker-bootstrap.sh"]
