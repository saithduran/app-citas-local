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

// Ruta para loger  y autenticación de usuario
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
// Ruta para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
//Rutas para editar, eliminar y mostrar citas
Route::get('/cita/{codigo}', [CitaController::class, 'show']);
Route::put('/cita/{codigo}', [CitaController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/cita/{codigo}', [CitaController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/citas', [CitaController::class, 'index'])->middleware('auth:sanctum');
Route::get('/usuariocitas/{id}', [CitaController::class, 'usuarioCitas']);
//Usuarios
Route::post('/registrarusuarios', [UsuarioController::class, 'store'])->middleware('auth:sanctum');
Route::get('/usuarios', [UsuarioController::class, 'index'])->middleware('auth:sanctum');
Route::get('/usuario/{id}', [UsuarioController::class, 'datos'])->middleware('auth:sanctum');
Route::put('/usuario/{id}', [UsuarioController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/usuario/{id}', [UsuarioController::class, 'destroy'])->middleware('auth:sanctum');
//Tutores
Route::post('/registrartutor', [TutorController::class, 'store'])->middleware('auth:sanctum');
Route::get('/tutores', [TutorController::class, 'index'])->middleware('auth:sanctum');
Route::get('/tutor/{id}', [TutorController::class, 'datos'])->middleware('auth:sanctum');
// Route::put('/tutor/{id}', [TutorController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/tutor/{id}', [TutorController::class, 'destroy'])->middleware('auth:sanctum');
//Rutas para agendamieto de citas
Route::post('/agendarcitas', [CitaController::class, 'store'])->middleware('auth:sanctum');
Route::get('/horarios-disponibles/{fecha}', [CitaController::class, 'getHorariosDisponibles']);