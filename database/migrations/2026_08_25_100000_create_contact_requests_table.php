<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no', 30)->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 50)->nullable();
            $table->string('subject', 100);
            $table->boolean('is_pre_registration_seminar')->default(false);
            $table->string('cooperative_name')->nullable();
            $table->integer('attendees_count')->nullable();
            $table->date('preferred_date')->nullable();
            $table->text('message');
            $table->string('status', 30)->default('Pending');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
    }
};
