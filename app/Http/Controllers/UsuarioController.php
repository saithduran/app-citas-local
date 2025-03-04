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
        $usuarios = Usuarios::all();
    
        return response()->json($usuarios);
    }

    public function datos($id){
        $usuario = Usuarios::select('id','nombre', 'celular', 'direccion')->where('id', $id)->first();
        
        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrada'], 404);
        }
    
        return response()->json($usuario);
    }

    // Actualizar una cita
    public function update(Request $request, $id){
    
        $usuario = Usuarios::where('id', $id)->first();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
            'direccion' => 'required|string|max:255'
        ]);

        $usuario->update([
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'direccion' => $request->direccion
        ]);

        return response()->json(['mensaje' => 'Usuario actualizada con éxito']);
    }

    public function destroy($id){
        $usuario = Usuarios::find($id);
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }


}

