<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeGovernance extends Model
{
    use HasFactory;

    protected $table = 'cooperative_governance';

    protected $fillable = [
        'cooperative_profile_id',
        'manager',
        'bookkeeper',
        'secretary',
        'treasurer',
        'loan_manager',
        'gad_focal',
    ];

    public function cooperativeProfile()
    {
        return $this->belongsTo(CooperativeProfile::class);
    }
}
