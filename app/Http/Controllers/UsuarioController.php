<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;

class UsuarioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cedula' => 'required|string',
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
            'fecha_nacimiento' => 'required|date',
            'direccion' => 'required|string|max:255',
            'peticion' => 'required|string|max:255',
            'fecha_ingreso' => 'required|date',
        ]);

        $usuario = Usuarios::create([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'direccion' => $request->direccion,
            'peticion' => $request->peticion,
            'fecha_ingreso' => $request->fecha_ingreso,
        ]);

        return response()->json(['message' => 'Usuario registrado con éxito', 'usuario' => $usuario], 201);
    }

    public function index(){
        $usuarios = Usuarios::where('estado_miembro', 'Activo')->get();
    
        return response()->json($usuarios);
    }

    public function datos($id){
        $usuario = Usuarios::select('id','cedula','nombre', 'celular','fecha_nacimiento','direccion','peticion','fecha_ingreso','estado_miembro')->where('id', $id)->first();
        
        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrada'], 404);
        }
    
        return response()->json($usuario);
    }

    public function citas($id){
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
            'cedula' => 'required|string',
            'nombre' => 'required|string|max:255',
            'celular' => 'required|string|max:10',
            'fecha_nacimiento' => 'required|date',
            'direccion' => 'required|string|max:255',
            'peticion' => 'required|string|max:255',
            'fecha_ingreso' => 'required|date',
        ]);

        $usuario->update([
            'cedula' => $request->cedula,
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'direccion' => $request->direccion,
            'peticion' => $request->peticion,
            'fecha_ingreso' => $request->fecha_ingreso,
            'estado_miembro' => $request->estado_miembro,
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

