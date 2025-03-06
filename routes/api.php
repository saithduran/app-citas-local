<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\TutorController;


//Ruta para enviar mensajes por whatsapp
// Route::get('/whatsapp/prueba', [WhatsAppController::class, 'enviarMensajePrueba']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Ruta para loger  y autenticación de usuario
    Route::post('/logout', [AuthController::class, 'logout']);
    // Ruta para obtener el usuario autenticado
    Route::get('/user', [AuthController::class, 'user']);
    //Rutas para editar, eliminar y mostrar citas
    Route::get('/cita/{codigo}', [CitaController::class, 'show']);
    Route::put('/cita/{codigo}', [CitaController::class, 'update']);
    Route::delete('/cita/{codigo}', [CitaController::class, 'destroy']);
    Route::get('/citas', [CitaController::class, 'index']);
    Route::get('/usuariocitas/{id}', [CitaController::class, 'usuarioCitas']);
    //Usuarios
    Route::post('/registrarusuarios', [UsuarioController::class, 'store']);
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::get('/usuario/{id}', [UsuarioController::class, 'datos']);
    Route::put('/usuario/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuario/{id}', [UsuarioController::class, 'destroy']);
    //Tutores
    Route::post('/registrartutor', [TutorController::class, 'store']);
    Route::get('/tutores', [TutorController::class, 'index']);
    Route::get('/tutor/{id}', [TutorController::class, 'datos']);
    // Route::put('/tutor/{id}', [TutorController::class, 'update']);
    Route::delete('/tutor/{id}', [TutorController::class, 'destroy']);
    //Rutas para agendamieto de citas
    Route::post('/agendarcitas', [CitaController::class, 'store']);
    Route::get('/horarios-disponibles/{fecha}', [CitaController::class, 'getHorariosDisponibles']);
});