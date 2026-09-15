<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoleResource\Pages;
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
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use UnitEnum;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ShieldCheck;

    protected static ?string $navigationLabel = 'Roles';

    protected static ?string $modelLabel = 'Rol';

    protected static ?string $pluralModelLabel = 'Roles';

    protected static string|UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 98;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin']) || auth()->user()->hasPermissionTo('view_any_role');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_role');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_role');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_role');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información del Rol')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nombre')
                            ->required()
                            ->maxLength(255)
                            ->unique(Role::class, 'name', ignoreRecord: true),
                    ])->columns(2),

                Section::make('Permisos')
                    ->description('Selecciona los permisos que tendrá este rol')
                    ->schema([
                        Forms\Components\CheckboxList::make('permissions')
                            ->label('Permisos')
                            ->relationship('permissions', 'name')
                            ->columns(3)
                            ->bulkToggleable(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable()
                    ->badge(),
                Tables\Columns\TextColumn::make('permissions_count')
                    ->label('Permisos')
                    ->counts('permissions')
                    ->sortable()
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
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
            'index' => Pages\ListRoles::route('/'),
            'create' => Pages\CreateRole::route('/create'),
            'edit' => Pages\EditRole::route('/{record}/edit'),
        ];
    }
}
