<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobCallResource\Pages;
use App\Models\JobCall;
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

class JobCallResource extends Resource
{
    protected static ?string $model = JobCall::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ClipboardDocumentList;

    protected static ?string $navigationLabel = 'Convocatorias';

    protected static ?string $modelLabel = 'Convocatoria';

    protected static ?string $pluralModelLabel = 'Convocatorias de Trabajo';

    protected static string|UnitEnum|null $navigationGroup = 'Contenido';

    protected static ?int $navigationSort = 4;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_job_call');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_job_call');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_job_call');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_job_call');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información General')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->placeholder('Ej: CAS N° 004-2026 - Especialista en TI')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('type')
                            ->label('Tipo de Convocatoria')
                            ->options([
                                'CAS' => 'CAS',
                                'CAP' => 'CAP',
                                'Prácticas' => 'Prácticas',
                                'otros' => 'Otros',
                            ])
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options([
                                'Vigente' => 'Vigente',
                                'En Evaluación' => 'En Evaluación',
                                'Concluida' => 'Concluida',
                                'Cancelada' => 'Cancelada',
                            ])
                            ->default('Vigente')
                            ->required(),
                    ])->columns(3),

                Section::make('Fechas de Postulación')
                    ->schema([
                        Forms\Components\DatePicker::make('start_date')
                            ->label('Fecha de Inicio')
                            ->required(),
                        Forms\Components\DatePicker::make('end_date')
                            ->label('Fecha de Cierre')
                            ->required()
                            ->afterOrEqual('start_date'),
                    ])->columns(2),

                Section::make('Ventana de Recepción de CVs')
                    ->description('Control estricto de horario para el botón de "Postular". Solo será visible entre estas fechas y horas.')
                    ->schema([
                        Forms\Components\DateTimePicker::make('application_start_at')
                            ->label('Inicio de Recepción de CVs')
                            ->helperText('Ej: 18/09/2026 08:30. El botón de postular aparecerá a partir de esta fecha y hora.')
                            ->required(),
                        Forms\Components\DateTimePicker::make('application_end_at')
                            ->label('Fin de Recepción de CVs')
                            ->helperText('Ej: 18/09/2026 16:30. El botón de postular desaparecerá después de esta fecha y hora.')
                            ->required()
                            ->afterOrEqual('application_start_at'),
                    ])->columns(2),

                Section::make('Descripción')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->label('Descripción de la Convocatoria')
                            ->placeholder('Detalle los requisitos, funciones y condiciones de la convocatoria...')
                            ->maxLength(10000)
                            ->rows(6)
                            ->columnSpanFull(),
                    ]),

                Section::make('Cronograma de Etapas')
                    ->description('Cronograma completo del proceso de selección')
                    ->schema([
                        Forms\Components\Repeater::make('schedule')
                            ->label('Etapas')
                            ->schema([
                                Forms\Components\TextInput::make('stage')
                                    ->label('Etapa')
                                    ->placeholder('Ej: Recepción de CVs, Evaluación de CV, Entrevista')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('date_range')
                                    ->label('Fecha(s)')
                                    ->placeholder('Ej: 18 de septiembre, 19 y 20 de septiembre')
                                    ->required()
                                    ->maxLength(255),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->addActionLabel('Agregar etapa')
                            ->reorderableWithButtons()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                Section::make('Documentos Adjuntos')
                    ->description('Documentos complementarios: Bases, Resultados Preliminares, Resultados Finales, etc.')
                    ->schema([
                        Forms\Components\Repeater::make('documents')
                            ->label('Documentos')
                            ->schema([
                                Forms\Components\TextInput::make('document_name')
                                    ->label('Nombre del Documento')
                                    ->placeholder('Ej: Bases de la Convocatoria, Resultados Preliminares')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\FileUpload::make('file_path')
                                    ->label('Archivo PDF')
                                    ->disk('public')
                                    ->directory('job-calls/documents')
                                    ->maxSize(10240)
                                    ->acceptedFileTypes(['application/pdf'])
                                    ->required()
                                    ->downloadable()
                                    ->previewable(false),
                                Forms\Components\DatePicker::make('published_at')
                                    ->label('Fecha de Publicación')
                                    ->required()
                                    ->default(now()),
                            ])
                            ->columns(3)
                            ->defaultItems(0)
                            ->addActionLabel('Agregar documento')
                            ->reorderableWithButtons()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'CAS' => 'info',
                        'CAP' => 'warning',
                        'Prácticas' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Vigente' => 'success',
                        'En Evaluación' => 'warning',
                        'Concluida' => 'gray',
                        'Cancelada' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('start_date')
                    ->label('Inicio')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->label('Cierre')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('documents_count')
                    ->label('Docs')
                    ->getStateUsing(fn ($record) => is_array($record->documents) ? count($record->documents) : 0)
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'Vigente' => 'Vigente',
                        'En Evaluación' => 'En Evaluación',
                        'Concluida' => 'Concluida',
                        'Cancelada' => 'Cancelada',
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->label('Tipo')
                    ->options([
                        'CAS' => 'CAS',
                        'CAP' => 'CAP',
                        'Prácticas' => 'Prácticas',
                        'otros' => 'Otros',
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
            'index' => Pages\ListJobCalls::route('/'),
            'create' => Pages\CreateJobCall::route('/create'),
            'edit' => Pages\EditJobCall::route('/{record}/edit'),
        ];
    }

    public static function getRelations(): array
    {
        return [
            'applications' => \App\Filament\Resources\JobCallResource\RelationManagers\ApplicationsRelationManager::class,
        ];
    }
}
