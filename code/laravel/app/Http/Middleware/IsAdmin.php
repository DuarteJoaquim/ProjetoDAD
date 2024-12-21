<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o utilizador autenticado é administrador
        if ($request->user() && $request->user()->type === 'A') {
            return $next($request);
        }

        // Retorna erro se o utilizador não for administrador
        return response()->json(['message' => 'Access denied'], 403);
    }
}
