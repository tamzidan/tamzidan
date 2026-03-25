<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'message',
        'photo',
        'likes',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'likes' => 'integer',
            'is_visible' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function replies(): HasMany
    {
        return $this->hasMany(CommentReply::class);
    }
}
