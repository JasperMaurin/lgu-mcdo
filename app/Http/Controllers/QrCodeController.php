<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    public function index()
    {
        $qrCodes = \App\Models\QrCode::orderBy('created_at', 'desc')->get();
        return \Inertia\Inertia::render('Feedback/GenerateQr', [
            'qrCodes' => $qrCodes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:qr_codes',
            'name' => 'required|string',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'venue' => 'nullable|string',
            'date' => 'nullable|date',
            'status' => 'required|string',
        ]);

        $validated['token'] = \Illuminate\Support\Str::random(10);

        $qrCode = \App\Models\QrCode::create($validated);

        return redirect()->back()->with('success', 'QR Code generated successfully!');
    }

    public function update(Request $request, $id)
    {
        $qrCode = \App\Models\QrCode::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $qrCode->update($validated);

        return redirect()->back()->with('success', 'QR Code status updated!');
    }

    public function destroy($id)
    {
        $qrCode = \App\Models\QrCode::findOrFail($id);
        $qrCode->delete();

        return redirect()->back()->with('success', 'QR Code deleted!');
    }
}
