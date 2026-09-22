<?php

namespace App\Filament\Resources\DocumentEntries;

use App\Filament\Resources\DocumentEntries\Pages;
use App\Models\Area;
use App\Models\DocumentEntry;
use App\Models\DocumentMovement;
use App\Models\User;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;

class DocumentEntryResource extends Resource
{
    protected static ?string $model = DocumentEntry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Inbox;

    protected static ?string $navigationLabel = 'Mesa de Partes';

    protected static ?string $modelLabel = 'Expediente';

    protected static ?string $pluralModelLabel = 'Expedientes';

    protected static string|UnitEnum|null $navigationGroup = 'Operativo';

    protected static ?int $navigationSort = 9;

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $user = auth()->user();

        if ($user->hasAnyRole(['super_admin', 'admin', 'editor'])) {
            return parent::getEloquentQuery();
        }

        if ($user->hasAnyRole(['mesa_de_partes', 'secretaria_area'])) {
            return parent::getEloquentQuery()
                ->where(function ($query) use ($user) {
                    $query->whereHas('latestMovement', function ($q) use ($user) {
                        $q->where('to_area_id', $user->area_id);
                    })
                    ->orWhereHas('movements', function ($q) use ($user) {
                        $q->where('from_user_id', $user->id);
                    });
                });
        }

        if ($user->hasRole('jefe_area')) {
            return parent::getEloquentQuery()
                ->whereHas('latestMovement', function ($q) use ($user) {
                    $q->where('to_area_id', $user->area_id)
                        ->where('is_received', true)
                        ->whereNull('to_user_id');
                });
        }

        if ($user->hasRole('especialista')) {
            return parent::getEloquentQuery()
                ->whereHas('latestMovement', function ($q) use ($user) {
                    $q->where('to_user_id', $user->id);
                });
        }

        return parent::getEloquentQuery()->whereRaw('0 = 1');
    }

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole([
            'super_admin', 'admin', 'editor',
            'mesa_de_partes', 'secretaria_area', 'jefe_area', 'especialista',
        ]);
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'admin', 'mesa_de_partes']);
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'admin', 'mesa_de_partes', 'secretaria_area', 'jefe_area']);
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'admin']);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Datos del Remitente')
                    ->schema([
                        Forms\Components\Select::make('sender_type')
                            ->label('Tipo de Remitente')
                            ->options([
                                'Persona Natural' => 'Persona Natural',
                                'Persona Jurídica' => 'Persona Jurídica',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('document_number')
                            ->label('N° Documento (DNI/RUC)')
                            ->required()
                            ->maxLength(20),
                        Forms\Components\TextInput::make('sender_name')
                            ->label('Nombres Completos / Razón Social')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->label('Correo Electrónico')
                            ->email()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->label('Teléfono / Celular')
                            ->tel()
                            ->maxLength(20),
                    ])->columns(2),

                Section::make('Datos del Documento')
                    ->schema([
                        Forms\Components\Select::make('document_type')
                            ->label('Tipo de Documento')
                            ->options([
                                'Solicitud' => 'Solicitud',
                                'Oficio' => 'Oficio',
                                'Carta' => 'Carta',
                                'FUT' => 'FUT',
                                'Memorando' => 'Memorando',
                                'Informe' => 'Informe',
                                'Otro' => 'Otro',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('subject')
                            ->label('Asunto')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('folios')
                            ->label('N° de Folios')
                            ->numeric()
                            ->required()
                            ->default(1)
                            ->minValue(1),
                        Forms\Components\FileUpload::make('main_file_path')
                            ->label('Documento Principal (PDF)')
                            ->disk('public')
                            ->directory('document-entries/main')
                            ->acceptedFileTypes(['application/pdf'])
                            ->maxSize(10240)
                            ->required()
                            ->downloadable()
                            ->previewable(),
                        Forms\Components\FileUpload::make('annexes_file_path')
                            ->label('Anexos (PDF)')
                            ->disk('public')
                            ->directory('document-entries/annexes')
                            ->acceptedFileTypes(['application/pdf'])
                            ->maxSize(10240)
                            ->multiple()
                            ->downloadable()
                            ->previewable(),
                    ])->columns(2),

                Section::make('Seguimiento')
                    ->schema([
                        Forms\Components\TextInput::make('tracking_number')
                            ->label('N° de Seguimiento')
                            ->disabled()
                            ->dehydrated(false)
                            ->columnSpan(2),
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options([
                                'Pendiente' => 'Pendiente',
                                'En Proceso' => 'En Proceso',
                                'Observado' => 'Observado',
                                'Atendido' => 'Atendido',
                                'Rechazado' => 'Rechazado',
                            ])
                            ->required()
                            ->default('Pendiente')
                            ->native(false),
                        Forms\Components\Textarea::make('official_response')
                            ->label('Respuesta Oficial')
                            ->rows(5)
                            ->placeholder('Respuesta institucional al ciudadano...')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tracking_number')
                    ->label('N° Seguimiento')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('sender_name')
                    ->label('Remitente')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('document_type')
                    ->label('Tipo Doc.')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Solicitud' => 'info',
                        'Oficio' => 'primary',
                        'Carta' => 'gray',
                        'FUT' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('subject')
                    ->label('Asunto')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado Global')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Pendiente' => 'warning',
                        'En Proceso' => 'info',
                        'Observado' => 'danger',
                        'Atendido' => 'success',
                        'Rechazado' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('current_location')
                    ->label('Ubicación Actual')
                    ->searchable()
                    ->limit(40)
                    ->tooltip(fn (DocumentEntry $record): string => $record->current_location),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha Ingreso')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'Pendiente' => 'Pendiente',
                        'En Proceso' => 'En Proceso',
                        'Observado' => 'Observado',
                        'Atendido' => 'Atendido',
                        'Rechazado' => 'Rechazado',
                    ]),
                Tables\Filters\SelectFilter::make('sender_type')
                    ->label('Tipo Remitente')
                    ->options([
                        'Persona Natural' => 'Persona Natural',
                        'Persona Jurídica' => 'Persona Jurídica',
                    ]),
                Tables\Filters\SelectFilter::make('document_type')
                    ->label('Tipo Documento')
                    ->options([
                        'Solicitud' => 'Solicitud',
                        'Oficio' => 'Oficio',
                        'Carta' => 'Carta',
                        'FUT' => 'FUT',
                        'Memorando' => 'Memorando',
                        'Informe' => 'Informe',
                        'Otro' => 'Otro',
                    ]),
            ])
            ->actions([
                Actions\ViewAction::make(),

                Actions\EditAction::make(),

                Actions\Action::make('recepcionar')
                    ->label('Recepcionar')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Recepcionar Expediente')
                    ->modalDescription('Confirma que el documento ha sido recepcionado en tu área. Esto registrará la fecha y hora de recepción (Cargo digital).')
                    ->modalSubmitActionLabel('Sí, Recepcionar')
                    ->action(function (DocumentEntry $record): void {
                        $user = auth()->user();

                        $movement = DocumentMovement::where('document_entry_id', $record->id)
                            ->where('to_area_id', $user->area_id)
                            ->where('is_received', false)
                            ->latest()
                            ->first();

                        if ($movement) {
                            $movement->update([
                                'is_received' => true,
                                'received_at' => now(),
                            ]);
                        }
                    })
                    ->visible(function (DocumentEntry $record): bool {
                        $user = auth()->user();
                        if (!$user->area_id) return false;

                        $latest = $record->latestMovement;
                        if (!$latest) return false;
                        if ($latest->to_area_id !== $user->area_id) return false;

                        if ($user->hasRole('secretaria_area')) {
                            return !$latest->is_received && is_null($latest->to_user_id);
                        }

                        if ($user->hasRole('especialista')) {
                            return !$latest->is_received && $latest->to_user_id === $user->id;
                        }

                        return false;
                    }),

                Actions\Action::make('derivarAsignar')
                    ->label('Derivar / Asignar')
                    ->icon('heroicon-o-arrow-right-circle')
                    ->color('primary')
                    ->requiresConfirmation()
                    ->modalHeading('Derivar Expediente')
                    ->modalSubmitActionLabel('Derivar')
                    ->form([
                        Forms\Components\Select::make('tipo_envio')
                            ->label('Tipo de Envío')
                            ->options(function () {
                                $user = auth()->user();
                                if ($user->hasRole('secretaria_area')) {
                                    return ['area' => 'A otra Área'];
                                }
                                return [
                                    'area' => 'A otra Área',
                                    'especialista' => 'A un Especialista de mi Área',
                                ];
                            })
                            ->required()
                            ->live()
                            ->native(false),
                        Forms\Components\Select::make('to_area_id')
                            ->label('Área Destino')
                            ->options(function () {
                                $user = auth()->user();

                                if ($user->hasAnyRole(['mesa_de_partes', 'secretaria_area'])) {
                                    return Area::whereNull('parent_id')
                                        ->where('id', '!=', $user->area_id)
                                        ->pluck('name', 'id');
                                }

                                $parentAreas = Area::whereNull('parent_id')
                                    ->where('id', '!=', $user->area_id)
                                    ->pluck('name', 'id');

                                $subAreas = Area::where('parent_id', $user->area_id)
                                    ->pluck('name', 'id')
                                    ->mapWithKeys(fn ($name, $id) => ['sub_' . $id => '└ ' . $name]);

                                return $parentAreas->merge($subAreas);
                            })
                            ->searchable()
                            ->preload()
                            ->required()
                            ->visible(fn (Get $get) => $get('tipo_envio') === 'area')
                            ->native(false),
                        Forms\Components\Select::make('to_user_id')
                            ->label('Especialista Destino')
                            ->options(function () {
                                $user = auth()->user();
                                if (!$user->area_id) return [];
                                return User::where('area_id', $user->area_id)
                                    ->where('id', '!=', $user->id)
                                    ->whereHas('roles', function ($q) {
                                        $q->where('name', 'especialista');
                                    })
                                    ->pluck('name', 'id');
                            })
                            ->searchable()
                            ->preload()
                            ->required()
                            ->visible(fn (Get $get) => $get('tipo_envio') === 'especialista')
                            ->native(false),
                        Forms\Components\Select::make('action_requested')
                            ->label('Proveído / Instrucción')
                            ->options([
                                'Para atención' => 'Para atención',
                                'Para informe' => 'Para informe',
                                'Para archivo' => 'Para archivo',
                                'Para revisión' => 'Para revisión',
                                'Para conformidad' => 'Para conformidad',
                                'Para visto bueno' => 'Para visto bueno',
                                'Para devolución' => 'Para devolución',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\Textarea::make('observations')
                            ->label('Observaciones')
                            ->rows(3)
                            ->placeholder('Indicaciones adicionales al destino...'),
                    ])
                    ->action(function (DocumentEntry $record, array $data): void {
                        $user = auth()->user();

                        if ($data['tipo_envio'] === 'area') {
                            $toAreaId = str_starts_with($data['to_area_id'], 'sub_')
                                ? (int) substr($data['to_area_id'], 4)
                                : (int) $data['to_area_id'];
                        } else {
                            $toAreaId = User::find($data['to_user_id'])?->area_id;
                        }

                        DocumentMovement::create([
                            'document_entry_id' => $record->id,
                            'from_area_id' => $user->area_id,
                            'from_user_id' => $user->id,
                            'to_area_id' => $toAreaId,
                            'to_user_id' => $data['to_user_id'] ?? null,
                            'action_requested' => $data['action_requested'],
                            'observations' => $data['observations'] ?? null,
                            'is_received' => false,
                        ]);

                        $record->update(['status' => 'En Proceso']);
                    })
                    ->visible(function (DocumentEntry $record): bool {
                        $user = auth()->user();

                        if ($record->status === 'Atendido' || $record->status === 'Rechazado') {
                            return false;
                        }

                        if ($user->hasAnyRole(['super_admin', 'admin'])) {
                            return true;
                        }

                        $latest = $record->latestMovement;
                        if (!$latest) return false;
                        if ($latest->to_area_id !== $user->area_id) return false;

                        if ($user->hasRole('secretaria_area')) {
                            return $latest->is_received;
                        }

                        if ($user->hasRole('jefe_area')) {
                            return $latest->is_received && is_null($latest->to_user_id);
                        }

                        return false;
                    }),

                Actions\Action::make('atender')
                    ->label('Atender / Finalizar')
                    ->icon('heroicon-o-document-check')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Atender Expediente')
                    ->modalDescription('Registra la respuesta oficial al ciudadano y cierra el expediente.')
                    ->modalSubmitActionLabel('Finalizar Expediente')
                    ->form([
                        Forms\Components\Select::make('status_final')
                            ->label('Estado Final')
                            ->options([
                                'Atendido' => 'Atendido',
                                'Archivado' => 'Archivado',
                            ])
                            ->required()
                            ->default('Atendido')
                            ->native(false),
                        Forms\Components\Textarea::make('official_response')
                            ->label('Respuesta Oficial')
                            ->rows(5)
                            ->required()
                            ->placeholder('Respuesta que verá el ciudadano...')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('response_file_path')
                            ->label('Archivo de Respuesta (PDF)')
                            ->disk('public')
                            ->directory('document-entries/responses')
                            ->acceptedFileTypes(['application/pdf'])
                            ->maxSize(10240)
                            ->downloadable()
                            ->previewable(),
                    ])
                    ->action(function (DocumentEntry $record, array $data): void {
                        $record->update([
                            'status' => $data['status_final'],
                            'official_response' => $data['official_response'],
                            'response_file_path' => $data['response_file_path'] ?? null,
                        ]);
                    })
                    ->visible(function (DocumentEntry $record): bool {
                        $user = auth()->user();

                        if ($record->status === 'Atendido' || $record->status === 'Rechazado') {
                            return false;
                        }

                        $latest = $record->latestMovement;
                        if (!$latest) return false;
                        if (!$latest->is_received) return false;

                        if ($user->hasAnyRole(['super_admin', 'admin'])) {
                            return true;
                        }

                        if ($user->hasRole('especialista')) {
                            return $latest->to_user_id === $user->id;
                        }

                        if ($user->hasRole('jefe_area')) {
                            return $latest->to_area_id === $user->area_id && is_null($latest->to_user_id);
                        }

                        return false;
                    }),

                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDocumentEntries::route('/'),
            'create' => Pages\CreateDocumentEntry::route('/create'),
            'edit' => Pages\EditDocumentEntry::route('/{record}/edit'),
            'view' => Pages\ViewDocumentEntry::route('/{record}'),
        ];
    }
}
