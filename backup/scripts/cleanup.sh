#!/bin/bash

set -e

# ==============================
# Variables
# ==============================

BACKUP_DIR="/backup"

DATABASE_DIR="$BACKUP_DIR/database"
MEDIA_DIR="$BACKUP_DIR/media"
LOG_DIR="$BACKUP_DIR/logs"

KEEP_DAYS=7

LOG_FILE="$LOG_DIR/cleanup.log"

mkdir -p "$LOG_DIR"

echo "========================================" >> "$LOG_FILE"
echo "Cleanup Started : $(date)" >> "$LOG_FILE"

# ==============================
# Remove old database backups
# ==============================

find "$DATABASE_DIR" \
-type f \
-name "*.gz" \
-mtime +$KEEP_DAYS \
-print \
-delete >> "$LOG_FILE"

# ==============================
# Remove old media backups
# ==============================

find "$MEDIA_DIR" \
-type f \
-name "*.gz" \
-mtime +$KEEP_DAYS \
-print \
-delete >> "$LOG_FILE"

echo "Cleanup Finished : $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"