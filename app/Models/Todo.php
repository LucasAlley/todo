<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'complete',
        'user_id'
    ];

    protected $hidden = [
        'user_id'
    ];

    public function toggleCompleted()
    {
        $this->complete = !$this->complete;
        return $this;
    }
}
