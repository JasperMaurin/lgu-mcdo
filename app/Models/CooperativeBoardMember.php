<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeBoardMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperative_profile_id',
        'position_order',
        'name',
    ];

    public function cooperativeProfile()
    {
        return $this->belongsTo(CooperativeProfile::class);
    }
}
