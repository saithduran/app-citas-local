<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($request->user());
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login exitoso',
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Eliminar todos los tokens del usuario autenticado
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
