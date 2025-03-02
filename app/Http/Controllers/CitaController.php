<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cita;
use App\Models\Usuarios;

class CitaController extends Controller
{
    // Guardar una nueva cita
    public function store(Request $request){
        $request->validate([
            'fecha' => 'required|date',
            'hora' => 'required',
            // 'nombre' => 'required|string|max:255',
            // 'celular' => 'required|string|max:10',
            'usuario_id' => 'required|exists:usuarios,id', // Validamos que el usuario exista
            'tutor_id' => 'required|exists:tutores,id', // Validamos que el usuario exista
        ]);
    
        $cita = Cita::create([
            'codigo' => uniqid(), // Generamos un código único
            'usuario_id' => $request->usuario_id, // Asignamos el usuario
            'tutor_id' => $request->tutor_id, // Asignamos el usuario
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            // 'nombre' => $request->nombre,
            // 'celular' => $request->celular,
        ]);
    
        return response()->json([
            'message' => 'Cita agendada con éxito',
            'codigo' => $cita->codigo,
        ], 201);
    }

    // Obtener todas las citas para mostrarlas en el calendario
    public function index()
    {
        $citas = Cita::with('usuario')->get(); // Cargamos el usuario asociado a cada cita
    
        $eventos = $citas->map(function ($cita) {
            return [
                'title' => 'Cita con ',
                'start' => $cita->fecha,
                'hora' => $cita->hora,
                'codigo' => $cita->codigo,
                'usuario' => $cita->usuario ? $cita->usuario->nombre : 'Desconocido',
            ];
        });
    
        return response()->json($eventos);
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

    public function show($codigo){
        $cita = Cita::with(['usuario', 'tutores'])->where('codigo', $codigo)->first();
    
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
            // 'celular' => 'required|string|max:10',
            'hora' => 'required',
            // 'nombre' => 'required|string|max:255',
        ]);

        $cita->update([
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            // 'nombre' => $request->nombre,
            // 'celular' => $request->celular
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
