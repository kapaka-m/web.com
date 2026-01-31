<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class DatabaseBackup extends Command
{
    protected $signature = 'db:backup';

    protected $description = 'Create a database backup file.';

    public function handle(): int
    {
        if (!config('backup.enabled')) {
            $this->warn('Database backup is disabled.');
            return self::SUCCESS;
        }

        $connection = config('database.default');
        $config = config("database.connections.{$connection}");
        if (!is_array($config)) {
            $this->error('Database connection configuration not found.');
            return self::FAILURE;
        }

        $driver = $config['driver'] ?? null;
        $backupPath = $this->ensureBackupPath();

        if ($driver === 'sqlite') {
            return $this->backupSqlite($config, $backupPath);
        }

        if ($driver === 'mysql') {
            return $this->backupMysql($config, $backupPath);
        }

        $this->error("Database driver '{$driver}' is not supported for backups.");
        return self::FAILURE;
    }

    private function ensureBackupPath(): string
    {
        $path = rtrim((string) config('backup.path'), DIRECTORY_SEPARATOR);
        if ($path === '') {
            $path = storage_path('app/backups');
        }

        if (!File::exists($path)) {
            File::makeDirectory($path, 0755, true);
        }

        $this->cleanupOldBackups($path);

        return $path;
    }

    private function backupSqlite(array $config, string $path): int
    {
        $database = $config['database'] ?? null;
        if (!$database || $database === ':memory:') {
            $this->error('SQLite database path is invalid.');
            return self::FAILURE;
        }

        if (!File::exists($database)) {
            $this->error('SQLite database file not found.');
            return self::FAILURE;
        }

        $filename = 'sqlite_backup_' . now()->format('Ymd_His') . '.sqlite';
        File::copy($database, $path . DIRECTORY_SEPARATOR . $filename);

        $this->info("SQLite backup saved to {$filename}.");

        return self::SUCCESS;
    }

    private function backupMysql(array $config, string $path): int
    {
        $database = $config['database'] ?? null;
        if (!$database) {
            $this->error('MySQL database name is missing.');
            return self::FAILURE;
        }

        $filename = 'mysql_' . $database . '_' . now()->format('Ymd_His') . '.sql';
        $filePath = $path . DIRECTORY_SEPARATOR . $filename;

        $binary = (string) config('backup.mysqldump_path', 'mysqldump');
        $host = $config['host'] ?? '127.0.0.1';
        $port = (string) ($config['port'] ?? '3306');
        $username = $config['username'] ?? '';
        $password = $config['password'] ?? '';
        $socket = $config['unix_socket'] ?? null;

        $command = [
            $binary,
            "--host={$host}",
            "--port={$port}",
            "--user={$username}",
            '--single-transaction',
            '--quick',
            '--routines',
            '--triggers',
            "--result-file={$filePath}",
            '--databases',
            $database,
        ];

        if (!empty($socket)) {
            $command[] = "--socket={$socket}";
        }

        $process = new Process($command, null, $password ? ['MYSQL_PWD' => $password] : null, null, 120);
        $process->run();

        if (!$process->isSuccessful()) {
            $this->error('Database backup failed.');
            $errorOutput = trim($process->getErrorOutput());
            if ($errorOutput !== '') {
                $this->line($errorOutput);
            }
            return self::FAILURE;
        }

        $this->info("MySQL backup saved to {$filename}.");

        return self::SUCCESS;
    }

    private function cleanupOldBackups(string $path): void
    {
        $retentionDays = (int) config('backup.retention_days', 7);
        if ($retentionDays <= 0 || !File::isDirectory($path)) {
            return;
        }

        $cutoff = now()->subDays($retentionDays)->getTimestamp();
        foreach (File::files($path) as $file) {
            if ($file->getMTime() < $cutoff) {
                File::delete($file->getRealPath());
            }
        }
    }
}
