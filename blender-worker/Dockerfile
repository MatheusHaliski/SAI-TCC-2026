FROM runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY blender-worker/requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

COPY blender-worker/handler.py /app/handler.py
COPY blender-worker/pipeline.py /app/pipeline.py
COPY blender-worker/blender-scripts /app/blender-scripts

# 🔥 ESSENCIAL
COPY blender_common /app/blender_common

COPY scripts/runpod-worker-bootstrap.sh /usr/local/bin/runpod-worker-bootstrap.sh
RUN chmod +x /usr/local/bin/runpod-worker-bootstrap.sh

CMD ["/usr/local/bin/runpod-worker-bootstrap.sh"]
