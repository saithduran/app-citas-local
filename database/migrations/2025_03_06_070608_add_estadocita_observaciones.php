<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('citas', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'confirmada', 'en proceso', 'cancelada', 'finalizada'])->default('pendiente')->after('hora');
            $table->text('observaciones')->nullable()->after('hora');
        });
    }

    public function down(): void {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropColumn(['estado', 'observaciones']);
        });
    }
};

