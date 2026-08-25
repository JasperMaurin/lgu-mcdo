<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrCode extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'token',
        'name',
        'category',
        'description',
        'venue',
        'date',
        'scans',
        'feedback',
        'rating',
        'status',
    ];
}
