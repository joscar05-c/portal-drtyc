<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Models\Project;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::MapPin;

    protected static ?string $navigationLabel = 'Obras Viales';

    protected static ?string $modelLabel = 'Obra';

    protected static ?string $pluralModelLabel = 'Obras y Mantenimiento Vial';

    protected static string|UnitEnum|null $navigationGroup = 'Operativo';

    protected static ?int $navigationSort = 6;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_project');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_project');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_project');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_project');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información de la Obra')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('location')
                            ->label('Ubicación')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('budget')
                            ->label('Presupuesto (S/)')
                            ->numeric()
                            ->prefix('S/')
                            ->step(0.01)
                            ->required(),
                    ])->columns(3),

                Section::make('Estado y Progreso')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options([
                                'planeamiento' => 'Planeamiento',
                                'en_ejecucion' => 'En Ejecución',
                                'paralizada' => 'Paralizada',
                                'culminada' => 'Culminada',
                            ])
                            ->default('planeamiento')
                            ->required(),
                        Forms\Components\TextInput::make('progress_percentage')
                            ->label('Progreso (%)')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->maxValue(100)
                            ->suffix('%')
                            ->required(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true),
                    ])->columns(3),

                Section::make('Imagen')
                    ->schema([
                        Forms\Components\FileUpload::make('image_path')
                            ->label('Imagen de la Obra')
                            ->disk('public')
                            ->image()
                            ->imageEditor()
                            ->directory('projects')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Imagen')
                    ->disk('public')
                    ->circular(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Obra')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('location')
                    ->label('Ubicación')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('budget')
                    ->label('Presupuesto')
                    ->formatStateUsing(fn ($state): string => 'S/ ' . number_format($state, 2))
                    ->sortable(),
                Tables\Columns\TextColumn::make('progress_percentage')
                    ->label('Progreso')
                    ->formatStateUsing(fn (int $state): string => $state . '%')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'planeamiento' => 'gray',
                        'en_ejecucion' => 'info',
                        'paralizada' => 'danger',
                        'culminada' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'planeamiento' => 'Planeamiento',
                        'en_ejecucion' => 'En Ejecución',
                        'paralizada' => 'Paralizada',
                        'culminada' => 'Culminada',
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
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
