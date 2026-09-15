<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ActivityResource\Pages;
use BackedEnum;
use Filament\Actions;
use Filament\Infolists;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;
use Spatie\Activitylog\Models\Activity;
use UnitEnum;

class ActivityResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Clock;

    protected static ?string $navigationLabel = 'Actividad';

    protected static ?string $modelLabel = 'Registro de Actividad';

    protected static ?string $pluralModelLabel = 'Registros de Actividad';

    protected static string|UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 99;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit($record): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Detalles de la Actividad')
                    ->schema([
                        Infolists\Components\TextEntry::make('description')
                            ->label('Acción')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'created' => 'success',
                                'updated' => 'warning',
                                'deleted' => 'danger',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Fecha y Hora')
                            ->dateTime('d/m/Y H:i:s'),
                        Infolists\Components\TextEntry::make('causer.name')
                            ->label('Usuario')
                            ->placeholder('Sistema'),
                        Infolists\Components\TextEntry::make('subject_type')
                            ->label('Módulo')
                            ->formatStateUsing(fn (?string $state): string => class_basename($state ?? '')),
                        Infolists\Components\TextEntry::make('subject_id')
                            ->label('ID del Registro'),
                    ])->columns(2),

                Section::make('Detalle de Cambios')
                    ->description('Comparación entre valores anteriores y nuevos')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Infolists\Components\KeyValueEntry::make('old_values')
                                    ->label('Valor Anterior')
                                    ->keyLabel('Campo')
                                    ->valueLabel('Antes')
                                    ->getStateUsing(fn (Activity $record): array => $record->attribute_changes->get('old') ?? []),

                                Infolists\Components\KeyValueEntry::make('new_values')
                                    ->label('Valor Nuevo')
                                    ->keyLabel('Campo')
                                    ->valueLabel('Ahora')
                                    ->getStateUsing(fn (Activity $record): array => $record->attribute_changes->get('attributes') ?? []),
                            ]),
                    ])
                    ->visible(fn (Activity $record): bool => !empty($record->attribute_changes->get('old')) || !empty($record->attribute_changes->get('attributes'))),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('description')
                    ->label('Acción')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'created' => 'success',
                        'updated' => 'warning',
                        'deleted' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('Usuario')
                    ->searchable()
                    ->placeholder('Sistema'),
                Tables\Columns\TextColumn::make('causer.email')
                    ->label('Email')
                    ->searchable()
                    ->placeholder('N/A'),
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Módulo')
                    ->formatStateUsing(fn (?string $state): string => class_basename($state ?? '')),
                Tables\Columns\TextColumn::make('subject_id')
                    ->label('ID'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('description')
                    ->label('Acción')
                    ->options([
                        'created' => 'Creado',
                        'updated' => 'Actualizado',
                        'deleted' => 'Eliminado',
                    ]),
            ])
            ->actions([
                Actions\ViewAction::make()
                    ->label('Ver'),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListActivities::route('/'),
            'view' => Pages\ViewActivity::route('/{record}'),
        ];
    }
}
