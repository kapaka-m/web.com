<?php
// MOHAMED HASSANIN (KAPAKA)

return [
    'enabled' => (bool) env('DB_BACKUP_ENABLED', true),
    'path' => env('DB_BACKUP_PATH', storage_path('app/backups')),
    'mysqldump_path' => env('DB_BACKUP_MYSQLEDUMP_PATH', 'mysqldump'),
    'retention_days' => (int) env('DB_BACKUP_RETENTION_DAYS', 7),
];
