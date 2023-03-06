<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTodoRequest;
use App\Http\Resources\TodoCollection;
use App\Models\Todo;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    //fetch users todos
    public function index(Request $request) 
    {
        $user = $request->user()->id;

        $completeParameter = $request->query('complete');
        $hasParameter = $request->has('complete');

        $query = Todo::where('user_id', $user)->orderBy('created_at','desc');
        if($hasParameter){
            $query->where('complete', $completeParameter);
        }

        $todos = $query->get();


        return [
            'todos' => $todos
        ];
    }
    
    public function create(CreateTodoRequest $request)
    {
        $data = $request->validated();
        $userID = $request->user()->id;

        $todo = Todo::create([
            'description' => $data['description'],
            'complete'=> $data['complete'],
            'user_id' => $userID
        ]);

        return response(['todo'=> $todo], 200);
    }

  
    public function update(Todo $todo, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $todo->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $todo->description =$request->input('description');
        $todo->save();

        return response('',200);


    }
    //toggle completed
    public function toggleCompleted(Todo $todo, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $todo->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $todo->toggleCompleted()->save();

        return response('',200);
    }

    //delete todo
    public function destroy(Todo $todo, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $todo->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $todo->delete();

        return response('', 204);
    }

    //delete completed todos
    public function destroyCompleted(Request $request)
    {
        $user = $request->user();

        
            Todo::where('user_id', $user->id)
                ->where('complete', 1)
                ->delete();
   

        return response('', 200);
    }

}
