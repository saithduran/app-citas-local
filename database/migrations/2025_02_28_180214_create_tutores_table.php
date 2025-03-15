<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('tutores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('celular');
            $table->timestamps();
        });

        Schema::table('citas', function (Blueprint $table) {
            $table->foreignId('tutor_id')->nullable()->constrained('tutores')->onDelete('set null');
        });
    }

    public function down() {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropForeign(['tutor_id']);
            $table->dropColumn('tutor_id');
        });

        Schema::dropIfExists('tutores');
    }
};

