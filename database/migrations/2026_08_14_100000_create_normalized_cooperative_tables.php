<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Master Services Table (Lookup Table)
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Seed default master services
        $defaultServices = [
            'Agricultural Support',
            'Copra Marketing and Trading',
            'Insurance Services',
            'Marketing Support',
            'Rice and Grocery Retail',
            'Social Services',
            'Technical Assistance',
            'Consumer Store',
            'Financial Services',
            'Lending/Credit Assistance for Member',
            'Other',
            'Skills Training and Livelihood Assistance',
            'Supply Chain',
            'Training Programs'
        ];

        foreach ($defaultServices as $serviceName) {
            DB::table('services')->insertOrIgnore([
                'name' => $serviceName,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 2. Pivot Table for Many-to-Many Cooperative Services (3NF Junction Table)
        Schema::create('cooperative_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->constrained('cooperative_profiles', 'id', 'fk_coop_services_profile')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services', 'id', 'fk_coop_services_service')->onDelete('cascade');
            $table->unique(['cooperative_profile_id', 'service_id'], 'uq_coop_service');
            $table->timestamps();
        });

        // 3. Normalized 1:1 Demographics & Membership Breakdown
        Schema::create('cooperative_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->unique('uq_coop_membership_profile')->constrained('cooperative_profiles', 'id', 'fk_coop_mem_profile')->onDelete('cascade');
            $table->integer('members_male')->default(0);
            $table->integer('members_female')->default(0);
            $table->integer('members_youth')->default(0);
            $table->integer('members_senior_ip')->default(0);
            $table->integer('total_members')->default(0);
            $table->timestamps();
        });

        // 4. Normalized 1:1 Key Management & Executive Officers
        Schema::create('cooperative_governance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->unique('uq_coop_gov_profile')->constrained('cooperative_profiles', 'id', 'fk_coop_gov_profile')->onDelete('cascade');
            $table->string('manager')->nullable();
            $table->string('bookkeeper')->nullable();
            $table->string('secretary')->nullable();
            $table->string('treasurer')->nullable();
            $table->string('loan_manager')->nullable();
            $table->string('gad_focal')->nullable();
            $table->timestamps();
        });

        // 5. Normalized 1:N Board of Directors Members
        Schema::create('cooperative_board_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->constrained('cooperative_profiles', 'id', 'fk_coop_board_profile')->onDelete('cascade');
            $table->integer('position_order')->default(1);
            $table->string('name');
            $table->timestamps();
        });

        // 6. Normalized 1:N Statutory Standing Committees Members
        Schema::create('cooperative_committee_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->constrained('cooperative_profiles', 'id', 'fk_coop_comm_profile')->onDelete('cascade');
            $table->string('committee_type'); // audit, election, credit, ethics, mediation, education, gad
            $table->integer('position_order')->default(1);
            $table->string('name');
            $table->timestamps();
        });

        // 7. Normalized 1:1 Financial Performance & Capitalization
        Schema::create('cooperative_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cooperative_profile_id')->unique('uq_coop_fin_profile')->constrained('cooperative_profiles', 'id', 'fk_coop_fin_profile')->onDelete('cascade');
            $table->decimal('total_assets', 15, 2)->default(0);
            $table->decimal('share_capital', 15, 2)->default(0);
            $table->decimal('net_surplus', 15, 2)->default(0);
            $table->decimal('annual_gross_income', 15, 2)->default(0);
            $table->decimal('authorize_capital', 15, 2)->default(0);
            $table->decimal('subscribe_capital', 15, 2)->default(0);
            $table->string('asset_classification')->default('Micro');
            $table->string('business_operation_desc')->nullable();
            $table->decimal('business_operation_amount', 15, 2)->default(0);
            $table->string('service_fees_desc')->nullable();
            $table->decimal('service_fees_amount', 15, 2)->default(0);
            $table->string('other_income_desc')->nullable();
            $table->decimal('other_income_amount', 15, 2)->default(0);
            $table->timestamps();
        });

        // Data migration: Migrate data from cooperative_profiles into normalized child tables
        $existingProfiles = DB::table('cooperative_profiles')->get();

        foreach ($existingProfiles as $p) {
            // 1. Membership data
            DB::table('cooperative_memberships')->insert([
                'cooperative_profile_id' => $p->id,
                'members_male' => $p->members_male ?? 0,
                'members_female' => $p->members_female ?? 0,
                'members_youth' => $p->members_youth ?? 0,
                'members_senior_ip' => $p->members_senior_ip ?? 0,
                'total_members' => $p->total_members ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Decode JSON fields if present
            $org = isset($p->org_structure) ? json_decode($p->org_structure, true) : [];
            $services = isset($p->services_offered) ? json_decode($p->services_offered, true) : [];
            $econ = isset($p->economic_performance) ? json_decode($p->economic_performance, true) : [];

            // 2. Governance
            $mgmt = $org['management'] ?? [];
            $gadFocal = $org['committees']['gadFocal'] ?? null;
            DB::table('cooperative_governance')->insert([
                'cooperative_profile_id' => $p->id,
                'manager' => $mgmt['manager'] ?? null,
                'bookkeeper' => $mgmt['bookkeeper'] ?? null,
                'secretary' => $mgmt['secretary'] ?? null,
                'treasurer' => $mgmt['treasurer'] ?? null,
                'loan_manager' => $mgmt['loanManager'] ?? null,
                'gad_focal' => $gadFocal,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Board members
            if (!empty($org['board']) && is_array($org['board'])) {
                foreach ($org['board'] as $idx => $bName) {
                    if (!empty($bName)) {
                        DB::table('cooperative_board_members')->insert([
                            'cooperative_profile_id' => $p->id,
                            'position_order' => $idx + 1,
                            'name' => $bName,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            // 4. Committees
            if (!empty($org['committees']) && is_array($org['committees'])) {
                foreach ($org['committees'] as $commKey => $commMembers) {
                    if ($commKey === 'gadFocal') continue;
                    if (is_array($commMembers)) {
                        foreach ($commMembers as $idx => $mName) {
                            if (!empty($mName)) {
                                DB::table('cooperative_committee_members')->insert([
                                    'cooperative_profile_id' => $p->id,
                                    'committee_type' => $commKey,
                                    'position_order' => $idx + 1,
                                    'name' => $mName,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ]);
                            }
                        }
                    }
                }
            }

            // 5. Services pivot
            if (is_array($services)) {
                foreach ($services as $serviceName) {
                    $serviceObj = DB::table('services')->where('name', $serviceName)->first();
                    if (!$serviceObj) {
                        $sId = DB::table('services')->insertGetId([
                            'name' => $serviceName,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    } else {
                        $sId = $serviceObj->id;
                    }
                    DB::table('cooperative_services')->insertOrIgnore([
                        'cooperative_profile_id' => $p->id,
                        'service_id' => $sId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 6. Financial Performance
            DB::table('cooperative_financials')->insert([
                'cooperative_profile_id' => $p->id,
                'total_assets' => $econ['totalAssets'] ?? $p->total_assets ?? 0,
                'share_capital' => $econ['cbuCollected'] ?? $p->share_capital ?? 0,
                'net_surplus' => $econ['netSurplus'] ?? 0,
                'annual_gross_income' => $econ['annualGrossIncome'] ?? 0,
                'authorize_capital' => $econ['authorizeCapital'] ?? 0,
                'subscribe_capital' => $econ['subscribeCapital'] ?? 0,
                'asset_classification' => $p->asset_classification ?? 'Micro',
                'business_operation_desc' => $econ['businessOperationDesc'] ?? null,
                'business_operation_amount' => $econ['businessOperationAmount'] ?? 0,
                'service_fees_desc' => $econ['serviceFeesDesc'] ?? null,
                'service_fees_amount' => $econ['serviceFeesAmount'] ?? 0,
                'other_income_desc' => $econ['otherIncomeDesc'] ?? null,
                'other_income_amount' => $econ['otherIncomeAmount'] ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Drop unnormalized JSON and duplicate columns from cooperative_profiles
        Schema::table('cooperative_profiles', function (Blueprint $table) {
            $table->dropColumn([
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
                'economic_performance'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cooperative_profiles', function (Blueprint $table) {
            $table->integer('members_male')->default(0);
            $table->integer('members_female')->default(0);
            $table->integer('members_youth')->default(0);
            $table->integer('members_senior_ip')->default(0);
            $table->integer('total_members')->default(0);
            $table->decimal('total_assets', 15, 2)->default(0);
            $table->decimal('share_capital', 15, 2)->default(0);
            $table->string('asset_classification')->default('Micro');
            $table->json('org_structure')->nullable();
            $table->json('services_offered')->nullable();
            $table->json('economic_performance')->nullable();
        });

        Schema::dropIfExists('cooperative_financials');
        Schema::dropIfExists('cooperative_committee_members');
        Schema::dropIfExists('cooperative_board_members');
        Schema::dropIfExists('cooperative_governance');
        Schema::dropIfExists('cooperative_memberships');
        Schema::dropIfExists('cooperative_services');
        Schema::dropIfExists('services');
    }
};
