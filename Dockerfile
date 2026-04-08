# RunPod wardrobe generation API image
FROM pytorch/pytorch:2.4.1-cuda12.1-cudnn9-runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

COPY blender-worker/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY blender-worker/ ./

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "handler:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
