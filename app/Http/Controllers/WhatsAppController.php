<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WhatsAppService;

class WhatsAppController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function enviarMensajePrueba()
    {
        $numero = "3142957768"; // Número de prueba
        $mensaje = "Hola, este es un mensaje de prueba desde Laravel 🚀";
        
        $respuesta = $this->whatsappService->enviarMensaje($numero, $mensaje);

        return response()->json($respuesta);
    }
}
