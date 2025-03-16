<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\TutorController;


//Ruta para enviar mensajes por whatsapp
// Route::get('/whatsapp/prueba', [WhatsAppController::class, 'enviarMensajePrueba']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test-db', [AuthController::class, 'store']);
Route::get('/test-db2', [AuthController::class, 'pruebadb']);
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
    Route::get('/miembroCitas/{id}', [CitaController::class, 'usuarioCitas']);
    //Usuarios
    Route::post('/registrarMiembro', [UsuarioController::class, 'store']);
    Route::get('/miembros', [UsuarioController::class, 'index']);
    Route::get('/miembro/{id}', [UsuarioController::class, 'datos']);
    Route::put('/miembro/{id}', [UsuarioController::class, 'update']);
    Route::delete('/miembro/{id}', [UsuarioController::class, 'destroy']);
    //Tutores
    Route::post('/registrarMinistro', [TutorController::class, 'store']);
    Route::get('/ministros', [TutorController::class, 'index']);
    Route::get('/ministro/{id}', [TutorController::class, 'datos']);
    Route::put('/ministro/{id}', [TutorController::class, 'update']);
    Route::delete('/ministro/{id}', [TutorController::class, 'destroy']);
    //Rutas para agendamieto de citas
    Route::post('/agendarcitas', [CitaController::class, 'store']);
    Route::get('/horariosDisponibles/{fecha}', [CitaController::class, 'getHorariosDisponibles']);
    Route::put('/citaDesarrollo/{codigo}', [CitaController::class, 'actualizarEstado']);
});
