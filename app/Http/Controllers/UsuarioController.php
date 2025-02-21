<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;

class UsuarioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|size:10',
            'direccion' => 'required|string|max:255',
        ]);

        $usuario = Usuarios::create([
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'direccion' => $request->direccion,
        ]);

        return response()->json(['message' => 'Usuario registrado con éxito', 'usuario' => $usuario], 201);
    }

    public function index(){
        return response()->json(Usuario::all());
    }

    public function destroy($id){
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }


}

