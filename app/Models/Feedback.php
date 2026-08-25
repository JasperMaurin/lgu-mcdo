<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        'qr_code_id',
        'rating',
        'timeliness',
        'professionalism',
        'clarity',
        'visitReason',
        'strengths',
        'improvements',
        'name',
        'barangay',
        'cooperative',
        'email',
        'isAnonymous',
        'status'
    ];

    public function qrCode()
    {
        return $this->belongsTo(QrCode::class);
    }

    public function trainingEvaluation()
    {
        return $this->hasOne(TrainingEvaluation::class);
    }
}
