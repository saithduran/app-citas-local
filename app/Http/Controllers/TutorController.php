<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutores;

class TutorController extends Controller
{
    public function index(){
        $tutores = Tutores::all();
    
        return response()->json($tutores);
    }
}
