FROM python:3.8-slim-buster


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


WORKDIR /app


COPY requirements.txt /app/


RUN pip install --upgrade pip && \
    pip install --default-timeout=100 --retries 10 \
    -i https://pypi.tuna.tsinghua.edu.cn/simple \
    -r requirements.txt && \
    rm -rf ~/.cache/pip


COPY ./Multi_Shop /app


EXPOSE 8000


CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
