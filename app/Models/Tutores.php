<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class Tutores extends Model {
    use HasFactory;

    protected $fillable = ['nombre_completo', 'telefono'];

    public function tutores() {
        return $this->hasMany(Cita::class, 'tutor_id');
    }
}

