<?php

namespace App\Http\Controllers;

use App\Models\CooperativeProfile;
use App\Models\CooperativeMembership;
use App\Models\CooperativeGovernance;
use App\Models\CooperativeBoardMember;
use App\Models\CooperativeCommitteeMember;
use App\Models\CooperativeFinancialPerformance;
use App\Models\Service;
use App\Mail\CooperativeProfileSavedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CooperativeProfilingController extends Controller
{
    public function index()
    {
        $profiles = CooperativeProfile::with([
            'membership',
            'governance',
            'boardMembers',
            'committeeMembers',
            'services',
            'financialPerformance'
        ])->orderBy('created_at', 'desc')->get();

        return Inertia::render('Cooperatives/Profiling', [
            'profiles' => $profiles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cda_registration_no' => 'required|string|unique:cooperative_profiles,cda_registration_no',
            'date_of_registration' => 'nullable|date',
            'name' => 'required|string|max:255',
            'coop_type' => 'required|string',
            'barangay' => 'nullable|string',
            'address' => 'nullable|string',
            'chairperson' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_number' => 'nullable|string',
            'compliance_status' => 'nullable|string',
            'coc_issued_date' => 'nullable|date',
            'tin_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'members_male' => 'nullable|integer|min:0',
            'members_female' => 'nullable|integer|min:0',
            'members_youth' => 'nullable|integer|min:0',
            'members_senior_ip' => 'nullable|integer|min:0',
            'org_structure' => 'nullable|array',
            'services_offered' => 'nullable|array',
            'economic_performance' => 'nullable|array',
        ]);

        DB::transaction(function () use ($request, $validated) {
            // 1. Core Profile
            $profileData = [
                'cda_registration_no' => $validated['cda_registration_no'],
                'date_of_registration' => $validated['date_of_registration'] ?? null,
                'name' => $validated['name'],
                'coop_type' => $validated['coop_type'] ?? 'Multipurpose',
                'barangay' => $validated['barangay'] ?? 'Poblacion',
                'address' => $validated['address'] ?? null,
                'chairperson' => $validated['chairperson'] ?? null,
                'contact_email' => $validated['contact_email'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'compliance_status' => $validated['compliance_status'] ?? 'Compliant',
                'coc_issued_date' => $validated['coc_issued_date'] ?? null,
                'tin_number' => $validated['tin_number'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ];

            $profile = CooperativeProfile::create($profileData);

            // 2. Membership Demographics
            $male = (int) ($validated['members_male'] ?? 0);
            $female = (int) ($validated['members_female'] ?? 0);
            $youth = (int) ($validated['members_youth'] ?? 0);
            $seniorIp = (int) ($validated['members_senior_ip'] ?? 0);

            CooperativeMembership::create([
                'cooperative_profile_id' => $profile->id,
                'members_male' => $male,
                'members_female' => $female,
                'members_youth' => $youth,
                'members_senior_ip' => $seniorIp,
                'total_members' => $male + $female,
            ]);

            // 3. Governance Officers & Committees
            $org = $validated['org_structure'] ?? [];
            $mgmt = $org['management'] ?? [];
            $gadFocal = $org['committees']['gadFocal'] ?? null;

            CooperativeGovernance::create([
                'cooperative_profile_id' => $profile->id,
                'manager' => $mgmt['manager'] ?? null,
                'bookkeeper' => $mgmt['bookkeeper'] ?? null,
                'secretary' => $mgmt['secretary'] ?? null,
                'treasurer' => $mgmt['treasurer'] ?? null,
                'loan_manager' => $mgmt['loanManager'] ?? null,
                'gad_focal' => $gadFocal,
            ]);

            // Board Members
            if (!empty($org['board']) && is_array($org['board'])) {
                foreach ($org['board'] as $idx => $bName) {
                    if (!empty(trim($bName))) {
                        CooperativeBoardMember::create([
                            'cooperative_profile_id' => $profile->id,
                            'position_order' => $idx + 1,
                            'name' => trim($bName),
                        ]);
                    }
                }
            }

            // Committee Members
            if (!empty($org['committees']) && is_array($org['committees'])) {
                foreach ($org['committees'] as $commKey => $commMembers) {
                    if ($commKey === 'gadFocal') continue;
                    if (is_array($commMembers)) {
                        foreach ($commMembers as $idx => $mName) {
                            if (!empty(trim($mName))) {
                                CooperativeCommitteeMember::create([
                                    'cooperative_profile_id' => $profile->id,
                                    'committee_type' => $commKey,
                                    'position_order' => $idx + 1,
                                    'name' => trim($mName),
                                ]);
                            }
                        }
                    }
                }
            }

            // 4. Services Offered (Pivot Table)
            $serviceIds = [];
            if (!empty($validated['services_offered']) && is_array($validated['services_offered'])) {
                foreach ($validated['services_offered'] as $sName) {
                    $service = Service::firstOrCreate(['name' => trim($sName)]);
                    $serviceIds[] = $service->id;
                }
            }
            $profile->services()->sync($serviceIds);

            // 5. Financial Performance
            $econ = $validated['economic_performance'] ?? [];
            $totalAssets = (float) ($econ['totalAssets'] ?? $request->input('total_assets', 0));
            $shareCapital = (float) ($econ['cbuCollected'] ?? $request->input('share_capital', 0));

            $assetClassification = 'Micro';
            if ($totalAssets > 100000000) {
                $assetClassification = 'Large';
            } elseif ($totalAssets > 15000000) {
                $assetClassification = 'Medium';
            } elseif ($totalAssets > 3000000) {
                $assetClassification = 'Small';
            }

            CooperativeFinancialPerformance::create([
                'cooperative_profile_id' => $profile->id,
                'total_assets' => $totalAssets,
                'share_capital' => $shareCapital,
                'net_surplus' => (float) ($econ['netSurplus'] ?? 0),
                'annual_gross_income' => (float) ($econ['annualGrossIncome'] ?? 0),
                'authorize_capital' => (float) ($econ['authorizeCapital'] ?? 0),
                'subscribe_capital' => (float) ($econ['subscribeCapital'] ?? 0),
                'asset_classification' => $assetClassification,
                'business_operation_desc' => $econ['businessOperationDesc'] ?? null,
                'business_operation_amount' => (float) ($econ['businessOperationAmount'] ?? 0),
                'service_fees_desc' => $econ['serviceFeesDesc'] ?? null,
                'service_fees_amount' => (float) ($econ['serviceFeesAmount'] ?? 0),
                'other_income_desc' => $econ['otherIncomeDesc'] ?? null,
                'other_income_amount' => (float) ($econ['otherIncomeAmount'] ?? 0),
            ]);

            // Dispatch Email Notification
            $this->sendProfileNotificationEmail($profile, 'submitted');
        });

        return redirect()->back()->with('success', 'Cooperative Profile submitted successfully and confirmation email sent!');
    }

    public function update(Request $request, $id)
    {
        $profile = CooperativeProfile::findOrFail($id);

        $validated = $request->validate([
            'cda_registration_no' => 'required|string|unique:cooperative_profiles,cda_registration_no,' . $id,
            'date_of_registration' => 'nullable|date',
            'name' => 'required|string|max:255',
            'coop_type' => 'required|string',
            'barangay' => 'nullable|string',
            'address' => 'nullable|string',
            'chairperson' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_number' => 'nullable|string',
            'compliance_status' => 'nullable|string',
            'coc_issued_date' => 'nullable|date',
            'tin_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'members_male' => 'nullable|integer|min:0',
            'members_female' => 'nullable|integer|min:0',
            'members_youth' => 'nullable|integer|min:0',
            'members_senior_ip' => 'nullable|integer|min:0',
            'org_structure' => 'nullable|array',
            'services_offered' => 'nullable|array',
            'economic_performance' => 'nullable|array',
        ]);

        DB::transaction(function () use ($profile, $request, $validated) {
            // 1. Update Core Profile
            $profile->update([
                'cda_registration_no' => $validated['cda_registration_no'],
                'date_of_registration' => $validated['date_of_registration'] ?? null,
                'name' => $validated['name'],
                'coop_type' => $validated['coop_type'] ?? 'Multipurpose',
                'barangay' => $validated['barangay'] ?? 'Poblacion',
                'address' => $validated['address'] ?? null,
                'chairperson' => $validated['chairperson'] ?? null,
                'contact_email' => $validated['contact_email'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'compliance_status' => $validated['compliance_status'] ?? 'Compliant',
                'coc_issued_date' => $validated['coc_issued_date'] ?? null,
                'tin_number' => $validated['tin_number'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // 2. Update Membership
            $male = (int) ($validated['members_male'] ?? 0);
            $female = (int) ($validated['members_female'] ?? 0);
            $youth = (int) ($validated['members_youth'] ?? 0);
            $seniorIp = (int) ($validated['members_senior_ip'] ?? 0);

            CooperativeMembership::updateOrCreate(
                ['cooperative_profile_id' => $profile->id],
                [
                    'members_male' => $male,
                    'members_female' => $female,
                    'members_youth' => $youth,
                    'members_senior_ip' => $seniorIp,
                    'total_members' => $male + $female,
                ]
            );

            // 3. Update Governance & Committees
            $org = $validated['org_structure'] ?? [];
            $mgmt = $org['management'] ?? [];
            $gadFocal = $org['committees']['gadFocal'] ?? null;

            CooperativeGovernance::updateOrCreate(
                ['cooperative_profile_id' => $profile->id],
                [
                    'manager' => $mgmt['manager'] ?? null,
                    'bookkeeper' => $mgmt['bookkeeper'] ?? null,
                    'secretary' => $mgmt['secretary'] ?? null,
                    'treasurer' => $mgmt['treasurer'] ?? null,
                    'loan_manager' => $mgmt['loanManager'] ?? null,
                    'gad_focal' => $gadFocal,
                ]
            );

            // Re-create Board Members
            $profile->boardMembers()->delete();
            if (!empty($org['board']) && is_array($org['board'])) {
                foreach ($org['board'] as $idx => $bName) {
                    if (!empty(trim($bName))) {
                        CooperativeBoardMember::create([
                            'cooperative_profile_id' => $profile->id,
                            'position_order' => $idx + 1,
                            'name' => trim($bName),
                        ]);
                    }
                }
            }

            // Re-create Committee Members
            $profile->committeeMembers()->delete();
            if (!empty($org['committees']) && is_array($org['committees'])) {
                foreach ($org['committees'] as $commKey => $commMembers) {
                    if ($commKey === 'gadFocal') continue;
                    if (is_array($commMembers)) {
                        foreach ($commMembers as $idx => $mName) {
                            if (!empty(trim($mName))) {
                                CooperativeCommitteeMember::create([
                                    'cooperative_profile_id' => $profile->id,
                                    'committee_type' => $commKey,
                                    'position_order' => $idx + 1,
                                    'name' => trim($mName),
                                ]);
                            }
                        }
                    }
                }
            }

            // 4. Update Services Offered
            $serviceIds = [];
            if (!empty($validated['services_offered']) && is_array($validated['services_offered'])) {
                foreach ($validated['services_offered'] as $sName) {
                    $service = Service::firstOrCreate(['name' => trim($sName)]);
                    $serviceIds[] = $service->id;
                }
            }
            $profile->services()->sync($serviceIds);

            // 5. Update Financial Performance
            $econ = $validated['economic_performance'] ?? [];
            $totalAssets = (float) ($econ['totalAssets'] ?? $request->input('total_assets', 0));
            $shareCapital = (float) ($econ['cbuCollected'] ?? $request->input('share_capital', 0));

            $assetClassification = 'Micro';
            if ($totalAssets > 100000000) {
                $assetClassification = 'Large';
            } elseif ($totalAssets > 15000000) {
                $assetClassification = 'Medium';
            } elseif ($totalAssets > 3000000) {
                $assetClassification = 'Small';
            }

            CooperativeFinancialPerformance::updateOrCreate(
                ['cooperative_profile_id' => $profile->id],
                [
                    'total_assets' => $totalAssets,
                    'share_capital' => $shareCapital,
                    'net_surplus' => (float) ($econ['netSurplus'] ?? 0),
                    'annual_gross_income' => (float) ($econ['annualGrossIncome'] ?? 0),
                    'authorize_capital' => (float) ($econ['authorizeCapital'] ?? 0),
                    'subscribe_capital' => (float) ($econ['subscribeCapital'] ?? 0),
                    'asset_classification' => $assetClassification,
                    'business_operation_desc' => $econ['businessOperationDesc'] ?? null,
                    'business_operation_amount' => (float) ($econ['businessOperationAmount'] ?? 0),
                    'service_fees_desc' => $econ['serviceFeesDesc'] ?? null,
                    'service_fees_amount' => (float) ($econ['serviceFeesAmount'] ?? 0),
                    'other_income_desc' => $econ['otherIncomeDesc'] ?? null,
                    'other_income_amount' => (float) ($econ['otherIncomeAmount'] ?? 0),
                ]
            );

            // Dispatch Email Notification
            $this->sendProfileNotificationEmail($profile, 'updated');
        });

        return redirect()->back()->with('success', 'Cooperative Profile updated successfully and confirmation email sent!');
    }

    private function sendProfileNotificationEmail(CooperativeProfile $profile, string $action = 'submitted')
    {
        try {
            $emails = array_values(array_unique(array_filter([
                $profile->contact_email,
                auth()->user()?->email,
                config('mail.from.address')
            ])));

            if (!empty($emails)) {
                Mail::to($emails)->send(new CooperativeProfileSavedMail($profile, $action));
            }
        } catch (\Throwable $e) {
            Log::error('Failed sending cooperative profile email: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $profile = CooperativeProfile::findOrFail($id);
        $profile->delete();

        return redirect()->back()->with('success', 'Cooperative Profile deleted successfully!');
    }

    private function seedInitialProfiles()
    {
        $initials = [
            [
                'cda_registration_no' => 'CDA-REG-9520-1002931',
                'date_of_registration' => '2015-04-12',
                'name' => 'Opol Multi-Purpose Farmers Cooperative',
                'coop_type' => 'Agriculture',
                'barangay' => 'Barangay 1',
                'address' => 'Purok 4, Main Highway, Barangay 1, Opol',
                'chairperson' => 'Juan Dela Cruz',
                'contact_email' => 'opol.farmers.coop@gmail.com',
                'contact_number' => '+63 917 123 4567',
                'compliance_status' => 'Compliant',
                'coc_issued_date' => '2026-01-15',
                'tin_number' => '412-589-321-000',
                'notes' => 'Active agricultural supplier and rice grain distribution hub in Opol.',
                'members_male' => 75,
                'members_female' => 45,
                'members_youth' => 15,
                'members_senior_ip' => 10,
                'org_structure' => [
                    'board' => ['Juan Dela Cruz', 'Robert Tan', 'Elena Vance', 'Gabriel Marcos', 'Sonia Lopez'],
                    'management' => [
                        'manager' => 'Carlos Mendoza',
                        'bookkeeper' => 'Luzviminda Cruz',
                        'secretary' => 'Rita Gomez',
                        'treasurer' => 'Fernando Poe Jr.',
                        'loanManager' => 'Grace Poe'
                    ],
                    'committees' => [
                        'audit' => ['Member A1', 'Member A2', 'Member A3'],
                        'election' => ['Member E1', 'Member E2', 'Member E3'],
                        'credit' => ['Member C1', 'Member C2', 'Member C3'],
                        'ethics' => ['Member Et1', 'Member Et2', 'Member Et3'],
                        'mediation' => ['Member M1', 'Member M2', 'Member M3'],
                        'education' => ['Member Ed1', 'Member Ed2', 'Member Ed3'],
                        'gad' => ['Member G1', 'Member G2', 'Member G3'],
                        'gadFocal' => 'Clara Santos'
                    ]
                ],
                'services_offered' => ['Agricultural Support', 'Marketing Support', 'Financial Services', 'Supply Chain'],
                'economic_performance' => [
                    'totalAssets' => 4850000,
                    'netSurplus' => 620000,
                    'cbuCollected' => 1200000,
                    'annualGrossIncome' => 2800000,
                    'authorizeCapital' => 5000000,
                    'subscribeCapital' => 2500000,
                    'businessOperationDesc' => 'Grain Milling & Rice Trading',
                    'businessOperationAmount' => 2200000,
                    'serviceFeesDesc' => 'Equipment Rental',
                    'serviceFeesAmount' => 400000,
                    'otherIncomeDesc' => 'Interest from Micro Loans',
                    'otherIncomeAmount' => 200000,
                ]
            ],
            [
                'cda_registration_no' => 'CDA-REG-9520-1004122',
                'date_of_registration' => '2018-09-05',
                'name' => 'Opol Drivers & Transport Service Cooperative',
                'coop_type' => 'Transport',
                'barangay' => 'Poblacion',
                'address' => 'Terminal Compound, Poblacion, Opol',
                'chairperson' => 'Maria Santos',
                'contact_email' => 'opoltransportcoop@yahoo.com',
                'contact_number' => '+63 920 987 6543',
                'compliance_status' => 'Compliant',
                'coc_issued_date' => '2026-02-10',
                'tin_number' => '908-112-443-000',
                'notes' => 'Operates public utility modern jeepneys along Opol-CDO routes.',
                'members_male' => 68,
                'members_female' => 17,
                'members_youth' => 8,
                'members_senior_ip' => 5,
                'org_structure' => [
                    'board' => ['Maria Santos', 'Danilo Perez', 'Mark Bautista', 'Rene Reyes', 'Leo Garcia'],
                    'management' => [
                        'manager' => 'Anton Diaz',
                        'bookkeeper' => 'Jenny Santos',
                        'secretary' => 'Gina Alajar',
                        'treasurer' => 'Paolo Contis',
                        'loanManager' => 'Arthur Solinap'
                    ],
                    'committees' => [
                        'audit' => ['Audit 1', 'Audit 2', 'Audit 3'],
                        'election' => ['Elec 1', 'Elec 2', 'Elec 3'],
                        'credit' => ['Cred 1', 'Cred 2', 'Cred 3'],
                        'ethics' => ['Eth 1', 'Eth 2', 'Eth 3'],
                        'mediation' => ['Med 1', 'Med 2', 'Med 3'],
                        'education' => ['Edu 1', 'Edu 2', 'Edu 3'],
                        'gad' => ['Gad 1', 'Gad 2', 'Gad 3'],
                        'gadFocal' => 'Theresa May'
                    ]
                ],
                'services_offered' => ['Financial Services', 'Lending/Credit Assistance for Member', 'Consumer Store'],
                'economic_performance' => [
                    'totalAssets' => 12500000,
                    'netSurplus' => 1100000,
                    'cbuCollected' => 3500000,
                    'annualGrossIncome' => 8500000,
                    'authorizeCapital' => 15000000,
                    'subscribeCapital' => 8000000,
                    'businessOperationDesc' => 'Transport Operations & Fare Collection',
                    'businessOperationAmount' => 7800000,
                    'serviceFeesDesc' => 'Garage & Terminal Rental',
                    'serviceFeesAmount' => 500000,
                    'otherIncomeDesc' => 'Dividends',
                    'otherIncomeAmount' => 200000,
                ]
            ]
        ];

        foreach ($initials as $data) {
            $req = new Request($data);
            $this->store($req);
        }
    }
}
