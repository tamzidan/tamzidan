<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            'type' => 'required|in:portfolio,certificate,comment',
        ]);

        $type = $request->input('type');
        $path = match ($type) {
            'portfolio' => 'portfolios',
            'certificate' => 'certificates/images',
            'comment' => 'comments',
            default => 'uploads',
        };

        $file = $request->file('image');
        $filename = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
        $storedPath = $file->storeAs($path, $filename, 'public');

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => [
                'url' => Storage::url($storedPath),
                'path' => $storedPath,
            ],
        ]);
    }

    public function uploadPdf(Request $request): JsonResponse
    {
        $request->validate([
            'pdf' => 'required|mimes:pdf|max:10240', // 10MB
        ]);

        $file = $request->file('pdf');
        $filename = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
        $storedPath = $file->storeAs('certificates/pdfs', $filename, 'public');

        return response()->json([
            'success' => true,
            'message' => 'PDF uploaded successfully',
            'data' => [
                'url' => Storage::url($storedPath),
                'path' => $storedPath,
            ],
        ]);
    }

    public function deleteFile(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'File not found',
        ], 404);
    }
}
