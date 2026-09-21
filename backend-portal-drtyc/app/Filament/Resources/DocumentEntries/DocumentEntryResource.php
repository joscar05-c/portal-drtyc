<?php

namespace App\Filament\Resources\DocumentEntries;

use App\Filament\Resources\DocumentEntries\Pages;
use App\Models\DocumentEntry;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas;
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

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_document_entry');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_document_entry');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_document_entry');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_document_entry');
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
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Pendiente' => 'warning',
                        'En Proceso' => 'info',
                        'Observado' => 'danger',
                        'Atendido' => 'success',
                        'Rechazado' => 'danger',
                        default => 'gray',
                    }),
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
                Actions\EditAction::make(),
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
        ];
    }
}
