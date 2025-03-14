<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutores;

class TutorController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string',
        ]);

        $tutor = Tutores::create([
            'nombre' => $request->nombre,
            'celular' => $request->celular,

        ]);

        return response()->json(['message' => 'Ministro registrado con éxito', 'Ministro' => $tutor], 201);
    }

    public function index(){
        $tutores = Tutores::where('estado_ministro', 'Activo')->get();
    
        return response()->json($tutores);
    }

    public function datos($id){
        $tutores = Tutores::find($id);
        return response()->json($tutores);
    }

    public function update(Request $request, $id){
    
        $Tutores = Tutores::where('id', $id)->first();

        if (!$Tutores) {
            return response()->json(['mensaje' => 'Ministro no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
            'estado_ministro' => 'required',
        ]);

        $Tutores->update([
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'estado_ministro' => $request->estado_ministro,
        ]);

        return response()->json(['mensaje' => 'Usuario actualizada con éxito']);
    }

    public function destroy($id){
        $tutores = Tutores::find($id);
        if (!$tutores) {
            return response()->json(['error' => 'Ministro no encontrado'], 404);
        }
        $tutores->delete();
        return response()->json(['message' => 'Ministro eliminado correctamente']);
    }
}
