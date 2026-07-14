<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector;');
        }

        Schema::create('lesson_transcripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->integer('timestamp_seconds');
            
            // Support vector data type dynamically if running on pgsql
            if (Schema::getConnection()->getDriverName() === 'pgsql') {
                $table->vector('embedding', 1536)->nullable();
            } else {
                $table->text('embedding')->nullable();
            }
            
            $table->timestamps();
        });

        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX ON lesson_transcripts USING hnsw (embedding vector_cosine_ops);');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_transcripts');
    }
};
