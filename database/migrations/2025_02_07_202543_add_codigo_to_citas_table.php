<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->string('codigo', 10)->unique()->after('id');
        });
    }
    
    public function down()
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropColumn('codigo');
        });
    }
    
};
