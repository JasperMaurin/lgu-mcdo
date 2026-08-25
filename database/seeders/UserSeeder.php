<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     *	Run the database seeds.
     */
    public function run(): void
    {
        $password = env('MCDO_ADMIN_PASSWORD', 'opolmcdo2026');

        User::updateOrCreate(['email' => env('MCDO_ADMIN_EMAIL', 'opolmcdo@gmail.com')], [
            'name' => 'MCDOpol Admin',
            'password' => bcrypt($password),
        ]);
    }
}
