<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop unique index if exists on api_token
        try {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique(['api_token']);
            });
        } catch (\Exception $e) {
            // Index might not exist or already dropped
        }

        // Change column to text
        Schema::table('users', function (Blueprint $table) {
            $table->text('api_token')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token', 80)->nullable()->change();
        });
    }
};
