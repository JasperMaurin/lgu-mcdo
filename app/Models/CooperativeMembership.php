<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeMembership extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperative_profile_id',
        'members_male',
        'members_female',
        'members_youth',
        'members_senior_ip',
        'total_members',
    ];

    protected $casts = [
        'members_male' => 'integer',
        'members_female' => 'integer',
        'members_youth' => 'integer',
        'members_senior_ip' => 'integer',
        'total_members' => 'integer',
    ];

    public function cooperativeProfile()
    {
        return $this->belongsTo(CooperativeProfile::class);
    }
}
