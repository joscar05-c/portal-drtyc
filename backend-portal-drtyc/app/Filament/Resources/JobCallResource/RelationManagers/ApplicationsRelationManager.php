<?php

namespace App\Filament\Resources\JobCallResource\RelationManagers;

use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

class ApplicationsRelationManager extends RelationManager
{
    protected static string $relationship = 'applications';

    protected static ?string $recordTitleAttribute = 'full_name';

    public function canCreate(): bool
    {
        return false;
    }

    public function canEdit($record): bool
    {
        return true;
    }

    public function canDelete($record): bool
    {
        return true;
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Select::make('status')
                    ->label('Estado')
                    ->options([
                        'Recibido' => 'Recibido',
                        'Apto' => 'Apto',
                        'No Apto' => 'No Apto',
                    ])
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('full_name')
            ->columns([
                Tables\Columns\TextColumn::make('document_number')
                    ->label('DNI/CE')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Nombre Completo')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Teléfono')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Recibido' => 'info',
                        'Apto' => 'success',
                        'No Apto' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha Postulación')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'Recibido' => 'Recibido',
                        'Apto' => 'Apto',
                        'No Apto' => 'No Apto',
                    ]),
            ])
            ->actions([
                Actions\Action::make('descargar_cv')
                    ->label('CV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('info')
                    ->url(fn ($record): string => Storage::disk('public')->url($record->file_path))
                    ->openUrlInNewTab(),
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
