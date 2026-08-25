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
        Schema::create('training_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feedback_id')->constrained('feedback')->onDelete('cascade');
            
            // Open-ended training feedback
            $table->text('liked_most')->nullable();
            $table->text('disliked')->nullable();
            $table->text('helpful_topic')->nullable();
            $table->text('unusable_topic')->nullable();
            $table->text('future_training')->nullable();
            $table->string('trainer_rating')->nullable();
            $table->string('time_sufficient')->nullable();
            $table->text('venue_feedback')->nullable();
            $table->string('recommend_training')->nullable();
            
            // Table 7
            $table->string('time_per_topic_rating')->nullable();
            $table->text('time_per_topic_comment')->nullable();
            $table->string('training_duration_rating')->nullable();
            $table->text('training_duration_comment')->nullable();
            
            // Table 8 Rating Matrix Metrics
            $table->string('expectations_met')->nullable();
            $table->string('objectives_achieved')->nullable();
            $table->string('topics_content')->nullable();
            $table->string('activities_conducted')->nullable();
            $table->string('teaching_methods')->nullable();
            $table->string('teaching_materials')->nullable();
            $table->string('speakers_rating')->nullable();
            $table->string('facilitators_rating')->nullable();
            $table->string('facilities_services')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_evaluations');
    }
};
