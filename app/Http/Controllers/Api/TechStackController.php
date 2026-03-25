<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TechStack;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TechStackController extends Controller
{
    public function index(): JsonResponse
    {
        $techStacks = TechStack::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $techStacks,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'proficiency' => 'nullable|string|max:255',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $techStack = TechStack::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tech stack created successfully',
            'data' => $techStack,
        ], 201);
    }

    public function show(TechStack $techStack): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $techStack,
        ]);
    }

    public function update(Request $request, TechStack $techStack): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string',
            'proficiency' => 'nullable|string|max:255',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $techStack->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tech stack updated successfully',
            'data' => $techStack,
        ]);
    }

    public function destroy(TechStack $techStack): JsonResponse
    {
        $techStack->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tech stack deleted successfully',
        ]);
    }
}
