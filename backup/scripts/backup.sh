#!/bin/bash

set -e

# ==============================
# Variables
# ==============================

DATE=$(date +"%Y-%m-%d_%H-%M-%S")

BACKUP_DIR="/backup"

DATABASE_DIR="$BACKUP_DIR/database"
MEDIA_DIR="$BACKUP_DIR/media"
LOG_DIR="$BACKUP_DIR/logs"

DB_NAME="multishop"
DB_USER="postgres"

MEDIA_PATH="/app/media"

mkdir -p "$DATABASE_DIR"
mkdir -p "$MEDIA_DIR"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/backup.log"

echo "========================================" >> "$LOG_FILE"
echo "Backup Started : $(date)" >> "$LOG_FILE"

# ==============================
# Database Backup
# ==============================

echo "Creating PostgreSQL Backup..." >> "$LOG_FILE"

pg_dump \
-U "$DB_USER" \
-F c \
"$DB_NAME" \
| gzip > "$DATABASE_DIR/database_$DATE.dump.gz"

echo "Database Backup Finished." >> "$LOG_FILE"

# ==============================
# Media Backup
# ==============================

echo "Creating Media Backup..." >> "$LOG_FILE"

tar -czf \
"$MEDIA_DIR/media_$DATE.tar.gz" \
"$MEDIA_PATH"

echo "Media Backup Finished." >> "$LOG_FILE"

# ==============================
# Finished
# ==============================

echo "Backup Finished Successfully : $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"