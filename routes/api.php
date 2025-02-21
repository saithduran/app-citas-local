<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\UsuarioController;


//Ruta para enviar mensajes por whatsapp
// Route::get('/whatsapp/prueba', [WhatsAppController::class, 'enviarMensajePrueba']);

// Ruta para loger  y autenticación de usuario
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
// Ruta para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
//Rutas para editar, eliminar y mostrar citas
Route::get('/cita/{codigo}', [CitaController::class, 'show']);
Route::put('/cita/{codigo}', [CitaController::class, 'update']);
Route::delete('/cita/{codigo}', [CitaController::class, 'destroy']);
Route::get('/citas', [CitaController::class, 'index'])->middleware('auth:sanctum');
//Rutas para agendamieto de citas
Route::post('/registrousuarios', [UsuarioController::class, 'store'])->middleware('auth:sanctum');
Route::post('/agendarcitas', [CitaController::class, 'store']);
Route::get('/horarios-disponibles/{fecha}', [CitaController::class, 'getHorariosDisponibles']);