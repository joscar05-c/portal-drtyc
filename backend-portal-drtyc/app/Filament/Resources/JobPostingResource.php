<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobPostingResource\Pages;
use App\Models\JobPosting;
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

class JobPostingResource extends Resource
{
    protected static ?string $model = JobPosting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentText;

    protected static ?string $navigationLabel = 'Convocatorias';

    protected static ?string $modelLabel = 'Convocatoria';

    protected static ?string $pluralModelLabel = 'Convocatorias CAS';

    protected static string|UnitEnum|null $navigationGroup = 'Contenido';

    protected static ?int $navigationSort = 3;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_job_posting');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_job_posting');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_job_posting');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_job_posting');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información de la Convocatoria')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options([
                                'vigente' => 'Vigente',
                                'evaluacion' => 'En Evaluación',
                                'finalizada' => 'Finalizada',
                            ])
                            ->default('vigente')
                            ->required(),
                    ])->columns(2),

                Section::make('Fechas')
                    ->schema([
                        Forms\Components\DatePicker::make('start_date')
                            ->label('Fecha de Inicio')
                            ->required(),
                        Forms\Components\DatePicker::make('end_date')
                            ->label('Fecha de Fin')
                            ->required()
                            ->afterOrEqual('start_date'),
                    ])->columns(2),

                Section::make('Descripción')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->label('Descripción')
                            ->maxLength(5000)
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),

                Section::make('Documento')
                    ->schema([
                        Forms\Components\FileUpload::make('bases_pdf_path')
                            ->label('Bases PDF')
                            ->disk('public')
                            ->directory('job-postings')
                            ->maxSize(10240)
                            ->acceptedFileTypes(['application/pdf'])
                            ->required()
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
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'vigente' => 'success',
                        'evaluacion' => 'warning',
                        'finalizada' => 'gray',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('start_date')
                    ->label('Inicio')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->label('Fin')
                    ->date('d/m/Y')
                    ->sortable(),
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
                        'vigente' => 'Vigente',
                        'evaluacion' => 'En Evaluación',
                        'finalizada' => 'Finalizada',
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
            'index' => Pages\ListJobPostings::route('/'),
            'create' => Pages\CreateJobPosting::route('/create'),
            'edit' => Pages\EditJobPosting::route('/{record}/edit'),
        ];
    }
}
