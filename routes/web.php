<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome'); // Asegúrate de que 'welcome' sea la vista que carga tu aplicación React.
})->where('any', '.*');

