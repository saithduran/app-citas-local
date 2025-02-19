<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cita extends Model
{
    protected $fillable = [
        'codigo', // Agregamos el nuevo campo
        'fecha',
        'hora',
        'nombre',
        'celular'
    ];

    /**
     * Generar un código único para la cita
     */
    public static function generarCodigoUnico()
    {
        do {
            $codigo = 'CITA-' . strtoupper(Str::random(6)); // Ejemplo: CITA-ABC123
        } while (self::where('codigo', $codigo)->exists()); // Verifica que no se repita

        return $codigo;
    }

    /**
     * Evento que se ejecuta antes de crear una nueva cita
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cita) {
            $cita->codigo = self::generarCodigoUnico();
        });
    }
}
