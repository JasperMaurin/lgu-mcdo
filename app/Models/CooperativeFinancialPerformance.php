<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeFinancialPerformance extends Model
{
    use HasFactory;

    protected $table = 'cooperative_financials';

    protected $fillable = [
        'cooperative_profile_id',
        'total_assets',
        'share_capital',
        'net_surplus',
        'annual_gross_income',
        'authorize_capital',
        'subscribe_capital',
        'asset_classification',
        'business_operation_desc',
        'business_operation_amount',
        'service_fees_desc',
        'service_fees_amount',
        'other_income_desc',
        'other_income_amount',
    ];

    protected $casts = [
        'total_assets' => 'float',
        'share_capital' => 'float',
        'net_surplus' => 'float',
        'annual_gross_income' => 'float',
        'authorize_capital' => 'float',
        'subscribe_capital' => 'float',
        'business_operation_amount' => 'float',
        'service_fees_amount' => 'float',
        'other_income_amount' => 'float',
    ];

    public function cooperativeProfile()
    {
        return $this->belongsTo(CooperativeProfile::class, 'cooperative_profile_id');
    }

    public function profile()
    {
        return $this->belongsTo(CooperativeProfile::class, 'cooperative_profile_id');
    }
}
