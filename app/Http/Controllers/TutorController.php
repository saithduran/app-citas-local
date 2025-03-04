<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutores;

class TutorController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string|max:255',
            'telefono' => 'required|string|size:10',
        ]);

        $tutor = Tutores::create([
            'nombre_completo' => $request->nombre_completo,
            'telefono' => $request->telefono,

        ]);

        return response()->json(['message' => 'Encaargado registrado con éxito', 'tutor' => $tutor], 201);
    }

    public function index(){
        $tutores = Tutores::all();
    
        return response()->json($tutores);
    }

    public function datos(){
        $tutores = Tutores::find($id);
        return response()->json($tutores);
    }

    public function destroy($id){
        $tutores = Tutores::find($id);
        if (!$tutores) {
            return response()->json(['error' => 'Encargado no encontrado'], 404);
        }
        $tutores->delete();
        return response()->json(['message' => 'Encargado eliminado correctamente']);
    }
}
