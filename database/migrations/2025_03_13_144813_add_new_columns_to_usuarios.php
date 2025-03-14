<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('usuarios', function (Blueprint $table) {
            // Agregar número de cédula antes del nombre
            $table->string('cedula', 10)->before('nombre');

            // Agregar fecha de nacimiento después de celular
            $table->date('fecha_nacimiento')->after('celular');

            // Agregar petición después de dirección
            $table->text('peticion')->after('direccion')->nullable();

            // Agregar fecha de ingreso después de fecha de nacimiento
            $table->date('fecha_ingreso')->after('fecha_nacimiento');

            // Agregar estado del miembro después de fecha de ingreso
            $table->enum('estado_miembro', ['Activo', 'Inactivo'])->after('fecha_ingreso')->default('Activo');

        });
    }

    public function down(): void {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn([
                'numero_cedula',
                'fecha_nacimiento',
                'fecha_ingreso',
                'estado_miembro',
                'peticion',
            ]);
        });
    }
};
