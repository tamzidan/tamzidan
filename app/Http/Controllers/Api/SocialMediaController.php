<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialMedia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SocialMediaController extends Controller
{
    public function index(): JsonResponse
    {
        $socialMedia = SocialMedia::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $socialMedia,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'icon' => 'nullable|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $socialMedia = SocialMedia::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Social media created successfully',
            'data' => $socialMedia,
        ], 201);
    }

    public function show(SocialMedia $socialMedia): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $socialMedia,
        ]);
    }

    public function update(Request $request, SocialMedia $socialMedia): JsonResponse
    {
        $validated = $request->validate([
            'platform' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url',
            'icon' => 'nullable|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $socialMedia->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Social media updated successfully',
            'data' => $socialMedia,
        ]);
    }

    public function destroy(SocialMedia $socialMedia): JsonResponse
    {
        $socialMedia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Social media deleted successfully',
        ]);
    }
}
