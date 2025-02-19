<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cita;

class CitaController extends Controller
{
    // Guardar una nueva cita
    public function store(Request $request){
        $request->validate([
            'fecha' => 'required|date',
            'hora' => 'required',
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
        ]);
    
        $cita = Cita::create([
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'nombre' => $request->nombre,
            'celular' => $request->celular
        ]);

        return response()->json([
            'message' => 'Cita agendada y confirmación enviada por WhatsApp',
            'codigo' => $cita->codigo, // Enviamos el código de la cita
        ], 201);
    }

    // Obtener los horarios disponibles para una fecha
    public function getHorariosDisponibles($fecha)
    {
        // Obtener los horarios ocupados para la fecha dada
        $horariosOcupados = Cita::where('fecha', $fecha)->pluck('hora')->toArray();

        // Definir todos los horarios posibles en formato de 24 horas
        $todosLosHorarios = [
            '09:00:00', '10:00:00', '11:00:00', '12:00:00',
            '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00'
        ];
    
        // Filtrar los horarios disponibles
        $horariosDisponibles = array_diff($todosLosHorarios, $horariosOcupados);

        // Devolver los horarios disponibles como un array en formato JSON
        return response()->json(array_values($horariosDisponibles));
    }

    public function consultarCitaPorCodigo($codigo) {
        $cita = Cita::where('codigo', $codigo)->first();
    
        if (!$cita) {
            return response()->json(['mensaje' => 'Cita no encontrada'], 404);
        }
    
        return response()->json($cita);
    }

    // Obtener todas las citas para mostrarlas en el calendario
    public function index()
    {
        $citas = Cita::all();

        $eventos = $citas->map(function ($cita) {
            return [
                'title' => 'Cita con ' . $cita->nombre,
                'start' => $cita->fecha, // Formato YYYY-MM-DD
                'hora' => $cita->hora,
                'codigo' => $cita->codigo,
            ];
        });

        return response()->json($eventos);
    }

    public function show($codigo)
    {
        $cita = Cita::where('codigo', $codigo)->first();
    
        if (!$cita) {
            return response()->json(['mensaje' => 'Cita no encontrada'], 404);
        }
    
        return response()->json($cita);
    }

    // Actualizar una cita
    public function update(Request $request, $codigo){
        
        $cita = Cita::where('codigo', $codigo)->first();

        if (!$cita) {
            return response()->json(['mensaje' => 'Cita no encontrada'], 404);
        }

        $request->validate([
            'fecha' => 'required|date',
            'hora' => 'required',
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
        ]);

        $cita->update([
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'nombre' => $request->nombre,
            'celular' => $request->celular
        ]);

        return response()->json(['mensaje' => 'Cita actualizada con éxito']);
    }

    // Eliminar una cita
    public function destroy($codigo){

        $cita = Cita::where('codigo', $codigo)->first();

        if (!$cita) {
            return response()->json(['mensaje' => 'Cita no encontrada'], 404);
        }

        $cita->delete();
        return response()->json(['mensaje' => 'Cita cancelada con éxito']);
    }

    
}
