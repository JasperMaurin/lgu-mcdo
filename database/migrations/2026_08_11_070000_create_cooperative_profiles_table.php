<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cooperative_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('cda_registration_no')->unique();
            $table->string('name');
            $table->string('coop_type')->default('Multi-Purpose');
            $table->string('barangay')->default('Poblacion');
            $table->text('address')->nullable();
            $table->string('chairperson')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_number')->nullable();
            $table->integer('members_male')->default(0);
            $table->integer('members_female')->default(0);
            $table->integer('total_members')->default(0);
            $table->decimal('total_assets', 15, 2)->default(0);
            $table->decimal('share_capital', 15, 2)->default(0);
            $table->string('asset_classification')->default('Micro');
            $table->string('compliance_status')->default('Compliant');
            $table->date('coc_issued_date')->nullable();
            $table->string('tin_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cooperative_profiles');
    }
};
