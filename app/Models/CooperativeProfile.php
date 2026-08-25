<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'cda_registration_no',
        'date_of_registration',
        'name',
        'coop_type',
        'barangay',
        'address',
        'chairperson',
        'contact_email',
        'contact_number',
        'compliance_status',
        'coc_issued_date',
        'tin_number',
        'notes',
    ];

    protected $casts = [
        'date_of_registration' => 'date',
        'coc_issued_date' => 'date',
    ];

    protected $appends = [
        'members_male',
        'members_female',
        'members_youth',
        'members_senior_ip',
        'total_members',
        'total_assets',
        'share_capital',
        'asset_classification',
        'org_structure',
        'services_offered',
        'economic_performance',
    ];

    // --- Eloquent Relationships (3NF Normalized Architecture) ---

    public function membership()
    {
        return $this->hasOne(CooperativeMembership::class, 'cooperative_profile_id');
    }

    public function governance()
    {
        return $this->hasOne(CooperativeGovernance::class, 'cooperative_profile_id');
    }

    public function boardMembers()
    {
        return $this->hasMany(CooperativeBoardMember::class, 'cooperative_profile_id')->orderBy('position_order');
    }

    public function committeeMembers()
    {
        return $this->hasMany(CooperativeCommitteeMember::class, 'cooperative_profile_id')->orderBy('position_order');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'cooperative_services', 'cooperative_profile_id', 'service_id');
    }

    public function financialPerformance()
    {
        return $this->hasOne(CooperativeFinancialPerformance::class, 'cooperative_profile_id');
    }

    public function financials()
    {
        return $this->hasOne(CooperativeFinancialPerformance::class, 'cooperative_profile_id');
    }

    // --- Dynamic Accessors to preserve seamless Inertia/React frontend compatibility ---

    public function getMembersMaleAttribute()
    {
        return $this->membership ? (int) $this->membership->members_male : 0;
    }

    public function getMembersFemaleAttribute()
    {
        return $this->membership ? (int) $this->membership->members_female : 0;
    }

    public function getMembersYouthAttribute()
    {
        return $this->membership ? (int) $this->membership->members_youth : 0;
    }

    public function getMembersSeniorIpAttribute()
    {
        return $this->membership ? (int) $this->membership->members_senior_ip : 0;
    }

    public function getTotalMembersAttribute()
    {
        return $this->membership ? (int) $this->membership->total_members : 0;
    }

    public function getTotalAssetsAttribute()
    {
        return $this->financialPerformance ? (float) $this->financialPerformance->total_assets : 0.0;
    }

    public function getShareCapitalAttribute()
    {
        return $this->financialPerformance ? (float) $this->financialPerformance->share_capital : 0.0;
    }

    public function getAssetClassificationAttribute()
    {
        return $this->financialPerformance ? $this->financialPerformance->asset_classification : 'Micro';
    }

    public function getOrgStructureAttribute()
    {
        $board = $this->boardMembers->pluck('name')->toArray();
        while (count($board) < 5) {
            $board[] = '';
        }

        $gov = $this->governance;
        $management = [
            'manager' => $gov->manager ?? '',
            'bookkeeper' => $gov->bookkeeper ?? '',
            'secretary' => $gov->secretary ?? '',
            'treasurer' => $gov->treasurer ?? '',
            'loanManager' => $gov->loan_manager ?? '',
        ];

        $committees = [
            'audit' => ['', '', ''],
            'election' => ['', '', ''],
            'credit' => ['', '', ''],
            'ethics' => ['', '', ''],
            'mediation' => ['', '', ''],
            'education' => ['', '', ''],
            'gad' => ['', '', ''],
            'gadFocal' => $gov->gad_focal ?? '',
        ];

        $commGrouped = $this->committeeMembers->groupBy('committee_type');
        foreach ($commGrouped as $type => $members) {
            $names = $members->pluck('name')->toArray();
            while (count($names) < 3) {
                $names[] = '';
            }
            $committees[$type] = array_slice($names, 0, 3);
        }

        return [
            'board' => array_slice($board, 0, 5),
            'management' => $management,
            'committees' => $committees,
        ];
    }

    public function getServicesOfferedAttribute()
    {
        return $this->services->pluck('name')->toArray();
    }

    public function getEconomicPerformanceAttribute()
    {
        $fp = $this->financialPerformance;
        return [
            'totalAssets' => $fp ? (float) $fp->total_assets : 0.0,
            'cbuCollected' => $fp ? (float) $fp->share_capital : 0.0,
            'netSurplus' => $fp ? (float) $fp->net_surplus : 0.0,
            'annualGrossIncome' => $fp ? (float) $fp->annual_gross_income : 0.0,
            'authorizeCapital' => $fp ? (float) $fp->authorize_capital : 0.0,
            'subscribeCapital' => $fp ? (float) $fp->subscribe_capital : 0.0,
            'businessOperationDesc' => $fp->business_operation_desc ?? '',
            'businessOperationAmount' => $fp ? (float) $fp->business_operation_amount : 0.0,
            'serviceFeesDesc' => $fp->service_fees_desc ?? '',
            'serviceFeesAmount' => $fp ? (float) $fp->service_fees_amount : 0.0,
            'otherIncomeDesc' => $fp->other_income_desc ?? '',
            'otherIncomeAmount' => $fp ? (float) $fp->other_income_amount : 0.0,
        ];
    }
}
