<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeCommitteeMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperative_profile_id',
        'committee_type',
        'position_order',
        'name',
    ];

    public function cooperativeProfile()
    {
        return $this->belongsTo(CooperativeProfile::class);
    }
}
