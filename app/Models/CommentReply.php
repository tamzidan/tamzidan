<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentReply extends Model
{
    /** @use HasFactory<\Database\Factories\CommentReplyFactory> */
    use HasFactory;

    protected $fillable = [
        'comment_id',
        'name',
        'message',
        'is_admin',
    ];

    protected function casts(): array
    {
        return [
            'comment_id' => 'integer',
            'is_admin' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }
}
