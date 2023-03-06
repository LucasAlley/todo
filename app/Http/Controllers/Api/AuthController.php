<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function register(RegisterRequest  $request){
        $data = $request->validated();
 
        $user = User::create([
            'email' => $data['email'],
            'password' =>bcrypt($data['password']),
        ]);

        $token =  $user->createToken('main')->plainTextToken;

        return response([
            'userID' => $user->id,
            'token' => $token
        ]);
    }

    public function login(LoginRequest $request){
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'message' => 'Check email or password and try again.' 
            ], 401);
        }

        //user provided correct credentials
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        

        return response(
            [
                'userID' => $user->id,
                'token' => $token
            ]
        );
    }

    public function logout(Request $request){
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('', 204);
    }

    public function me(Request $request)
    {
        $userID = $request->user()->id; 
        return response([
            'userID' => $userID
        ], 200);
    }

}
