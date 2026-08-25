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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->string('qr_code_id');
            $table->integer('rating');
            $table->string('timeliness')->nullable();
            $table->string('professionalism')->nullable();
            $table->string('clarity')->nullable();
            $table->string('visitReason')->nullable();
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->string('name')->nullable();
            $table->string('barangay')->nullable();
            $table->string('cooperative')->nullable();
            $table->string('email')->nullable();
            $table->boolean('isAnonymous')->default(false);
            $table->timestamps();

            $table->foreign('qr_code_id')->references('id')->on('qr_codes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
