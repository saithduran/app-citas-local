<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthenticateApi extends Middleware
{
    protected function unauthenticated($request, array $guards)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'No autenticado. Redirigir a /login',
            'login_url' => url('/login')
        ], 401));
    }
}
