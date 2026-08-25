<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no',
        'name',
        'email',
        'phone',
        'subject',
        'is_pre_registration_seminar',
        'cooperative_name',
        'attendees_count',
        'preferred_date',
        'message',
        'status',
        'ip_address',
    ];

    protected $casts = [
        'is_pre_registration_seminar' => 'boolean',
        'attendees_count' => 'integer',
        'preferred_date' => 'date',
    ];
}
