<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingEvaluation extends Model
{
    protected $table = 'training_evaluations';

    protected $fillable = [
        'feedback_id',
        'liked_most',
        'disliked',
        'helpful_topic',
        'unusable_topic',
        'future_training',
        'trainer_rating',
        'time_sufficient',
        'venue_feedback',
        'recommend_training',
        'time_per_topic_rating',
        'time_per_topic_comment',
        'training_duration_rating',
        'training_duration_comment',
        'expectations_met',
        'objectives_achieved',
        'topics_content',
        'activities_conducted',
        'teaching_methods',
        'teaching_materials',
        'speakers_rating',
        'facilitators_rating',
        'facilities_services',
    ];

    public function feedback()
    {
        return $this->belongsTo(Feedback::class);
    }
}
