<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cooperative_profiles', function (Blueprint $table) {
            $table->date('date_of_registration')->nullable()->after('cda_registration_no');
            $table->integer('members_youth')->default(0)->after('members_female');
            $table->integer('members_senior_ip')->default(0)->after('members_youth');
            
            // JSON fields for rich nested data
            $table->json('org_structure')->nullable()->after('notes');
            $table->json('services_offered')->nullable()->after('org_structure');
            $table->json('economic_performance')->nullable()->after('services_offered');
        });
    }

    public function down(): void
    {
        Schema::table('cooperative_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_registration',
                'members_youth',
                'members_senior_ip',
                'org_structure',
                'services_offered',
                'economic_performance'
            ]);
        });
    }
};
