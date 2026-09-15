<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProcedureResource\Pages;
use App\Models\Procedure;
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

class ProcedureResource extends Resource
{
    protected static ?string $model = Procedure::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentCheck;

    protected static ?string $navigationLabel = 'Trámites';

    protected static ?string $modelLabel = 'Trámite';

    protected static ?string $pluralModelLabel = 'Guía de Trámites (TUPA)';

    protected static string|UnitEnum|null $navigationGroup = 'Operativo';

    protected static ?int $navigationSort = 5;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_procedure');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_procedure');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_procedure');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_procedure');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información del Trámite')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->label('Descripción')
                            ->maxLength(1000)
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Requisitos')
                    ->schema([
                        Forms\Components\RichEditor::make('requirements')
                            ->label('Requisitos')
                            ->toolbarButtons([
                                'bold', 'italic', 'underline', 'strike',
                                'link', 'bulletList', 'orderedList',
                            ])
                            ->columnSpanFull(),
                    ]),

                Section::make('Costo y Tiempo Estimado')
                    ->schema([
                        Forms\Components\TextInput::make('cost')
                            ->label('Costo (S/)')
                            ->numeric()
                            ->prefix('S/')
                            ->step(0.01)
                            ->nullable(),
                        Forms\Components\TextInput::make('estimated_days')
                            ->label('Días Estimados')
                            ->numeric()
                            ->default(null)
                            ->suffix('días')
                            ->nullable(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true),
                    ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Trámite')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('cost')
                    ->label('Costo')
                    ->formatStateUsing(fn ($state): string => $state ? 'S/ ' . number_format($state, 2) : 'Gratuito')
                    ->sortable(),
                Tables\Columns\TextColumn::make('estimated_days')
                    ->label('Días')
                    ->suffix(' días')
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('title')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Activo'),
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
            'index' => Pages\ListProcedures::route('/'),
            'create' => Pages\CreateProcedure::route('/create'),
            'edit' => Pages\EditProcedure::route('/{record}/edit'),
        ];
    }
}
