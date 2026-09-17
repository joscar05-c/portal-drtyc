<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMesaPartesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxFileSize = 5120; // 5MB en KB

        return [
            'document_number' => 'required|string|max:20',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'document_type' => 'required|in:_documento,oficio,solicitud,denuncia,otros',
            'files' => 'required|array|min:1|max:3',
            'files.*' => [
                'file',
                'max:' . $maxFileSize,
                function ($attribute, $value, $fail) {
                    $allowedMimes = ['pdf', 'jpeg', 'jpg', 'png'];
                    $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

                    $extension = strtolower($value->getClientOriginalExtension());
                    $mimeType = $value->getMimeType();

                    if (!in_array($extension, $allowedExtensions)) {
                        $fail('El archivo "' . $value->getClientOriginalName() . '" tiene una extensión no permitida. Solo se aceptan: PDF, JPG, JPEG, PNG.');
                        return;
                    }

                    $realMimeMap = [
                        'application/pdf' => 'pdf',
                        'image/jpeg' => 'jpg',
                        'image/png' => 'png',
                    ];

                    $detectedExtension = $realMimeMap[$mimeType] ?? null;

                    if ($detectedExtension === null) {
                        $fail('El archivo "' . $value->getClientOriginalName() . '" no es un archivo válido. Extensión detectada: ' . $extension . ', MIME real: ' . $mimeType . '.');
                        return;
                    }

                    if ($detectedExtension !== $extension) {
                        $fail('El archivo "' . $value->getClientOriginalName() . '" tiene extensión "' . $extension . '" pero su contenido real es "' . $detectedExtension . '". Archivo rechazado.');
                        return;
                    }

                    if ($extension === 'pdf') {
                        $firstBytes = $value->getClientOriginalExtension();
                        $handle = fopen($value->getRealPath(), 'r');
                        if ($handle) {
                            $header = fread($handle, 5);
                            fclose($handle);
                            if ($header !== '%PDF-') {
                                $fail('El archivo "' . $value->getClientOriginalName() . '" dice ser PDF pero no contiene la firma válida (%PDF-).');
                                return;
                            }
                        }
                    }

                    if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
                        $handle = fopen($value->getRealPath(), 'r');
                        if ($handle) {
                            $header = fread($handle, 8);
                            fclose($handle);

                            $validJpeg = str_starts_with($header, "\xFF\xD8\xFF");
                            $validPng = str_starts_with($header, "\x89PNG\r\n\x1A\n");

                            if ($extension === 'jpg' || $extension === 'jpeg') {
                                if (!$validJpeg) {
                                    $fail('El archivo "' . $value->getClientOriginalName() . '" dice ser JPEG pero no contiene la firma válida (FFD8FF).');
                                    return;
                                }
                            }

                            if ($extension === 'png') {
                                if (!$validPng) {
                                    $fail('El archivo "' . $value->getClientOriginalName() . '" dice ser PNG pero no contiene la firma válida (89504E47).');
                                    return;
                                }
                            }
                        }
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'document_number.required' => 'El número de documento es obligatorio.',
            'full_name.required' => 'El nombre completo es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico no es válido.',
            'phone.required' => 'El teléfono es obligatorio.',
            'subject.required' => 'El asunto es obligatorio.',
            'description.required' => 'La descripción es obligatoria.',
            'document_type.required' => 'El tipo de documento es obligatorio.',
            'document_type.in' => 'El tipo de documento no es válido.',
            'files.required' => 'Debe adjuntar al menos un archivo.',
            'files.min' => 'Debe adjuntar al menos 1 archivo.',
            'files.max' => 'No puede adjuntar más de 3 archivos.',
            'files.*.max' => 'Cada archivo no debe superar los 5MB.',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Error de validación',
            'errors' => $validator->errors(),
        ], 422));
    }
}
