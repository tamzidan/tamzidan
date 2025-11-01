<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function index(): JsonResponse
    {
        $comments = Comment::query()
            ->where('is_visible', true)
            ->with('replies')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'photo' => 'nullable|string',
        ]);

        $comment = Comment::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Comment created successfully',
            'data' => $comment,
        ], 201);
    }

    public function show(Comment $comment): JsonResponse
    {
        $comment->load('replies');

        return response()->json([
            'success' => true,
            'data' => $comment,
        ]);
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'photo' => 'nullable|string',
            'is_visible' => 'boolean',
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => $comment,
        ]);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }

    public function like(Comment $comment): JsonResponse
    {
        $comment->increment('likes');

        return response()->json([
            'success' => true,
            'message' => 'Comment liked successfully',
            'data' => $comment,
        ]);
    }

    public function reply(Request $request, Comment $comment): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'is_admin' => 'boolean',
        ]);

        $reply = $comment->replies()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reply created successfully',
            'data' => $reply,
        ], 201);
    }
}
