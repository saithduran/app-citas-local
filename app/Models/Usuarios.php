<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class Usuarios extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'celular', 'direccion'];

    public function citas(){
        return $this->hasMany(Cita::class, 'usuario_id');
    }
    
}

