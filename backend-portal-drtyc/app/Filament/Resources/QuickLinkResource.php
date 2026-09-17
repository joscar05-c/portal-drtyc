<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QuickLinkResource\Pages;
use App\Models\QuickLink;
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

class QuickLinkResource extends Resource
{
    protected static ?string $model = QuickLink::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Link;

    protected static ?string $navigationLabel = 'Enlaces Rápidos';

    protected static ?string $modelLabel = 'Enlace Rápido';

    protected static ?string $pluralModelLabel = 'Enlaces Rápidos';

    protected static string|UnitEnum|null $navigationGroup = 'Contenido';

    protected static ?int $navigationSort = 4;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_quick_link');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_quick_link');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_quick_link');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_quick_link');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información del Enlace')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('url')
                            ->label('URL')
                            ->url()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Orden')
                            ->numeric()
                            ->default(0)
                            ->required(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true),
                    ])->columns(2),

                Section::make('Contenido de la Tarjeta')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->label('Descripción')
                            ->rows(3)
                            ->maxLength(500)
                            ->placeholder('Texto descriptivo del trámite o servicio'),
                        Forms\Components\TextInput::make('badge_text')
                            ->label('Badge (Etiqueta)')
                            ->placeholder('Ej: En Línea, Trámite Clave')
                            ->maxLength(50),
                        Forms\Components\Select::make('badge_color')
                            ->label('Color del Badge')
                            ->options([
                                'secondary' => 'Secundario (Azul claro)',
                                'primary' => 'Primario (Azul oscuro)',
                                'surface' => 'Superficie (Gris)',
                            ])
                            ->default('secondary')
                            ->required(),
                    ])->columns(2),

                Section::make('Icono y Acción')
                    ->schema([
                        Forms\Components\Select::make('icon')
                            ->label('Icono del Trámite')
                            ->allowHtml()
                            ->options([
                                'badge' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">badge</span> <span>badge (Licencia/Brevete)</span></div>',
                                'mark_email_unread' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">mark_email_unread</span> <span>mark_email_unread (Mesa de Partes)</span></div>',
                                'receipt_long' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">receipt_long</span> <span>receipt_long (Récord/Papeletas)</span></div>',
                                'local_parking' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">local_parking</span> <span>local_parking (Depósito Vehicular)</span></div>',
                                'local_shipping' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">local_shipping</span> <span>local_shipping (Transporte/Carga)</span></div>',
                                'payments' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">payments</span> <span>payments (Pagos/Tasas)</span></div>',
                            ])
                            ->placeholder('Seleccionar icono...')
                            ->searchable()
                            ->helperText('Icono Material Symbols del trámite'),
                        Forms\Components\TextInput::make('footer_info')
                            ->label('Info inferior (meta)')
                            ->placeholder('Ej: Plazo: Inmediato, Costo: Gratuito')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('button_text')
                            ->label('Texto del Botón')
                            ->placeholder('Ej: Iniciar Consulta, Ver más')
                            ->maxLength(100),
                        Forms\Components\Select::make('button_icon')
                            ->label('Icono del Botón')
                            ->allowHtml()
                            ->options([
                                'arrow_forward' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">arrow_forward</span> <span>arrow_forward (Flecha continuar)</span></div>',
                                'download' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">download</span> <span>download (Descargar)</span></div>',
                                'open_in_new' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">open_in_new</span> <span>open_in_new (Enlace externo)</span></div>',
                            ])
                            ->placeholder('Seleccionar icono...')
                            ->searchable()
                            ->helperText('Icono de la acción del enlace'),
                    ])->columns(3),
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
                Tables\Columns\TextColumn::make('url')
                    ->label('URL')
                    ->limit(40)
                    ->copyable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Orden')
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Activo')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
            'index' => Pages\ListQuickLinks::route('/'),
            'create' => Pages\CreateQuickLink::route('/create'),
            'edit' => Pages\EditQuickLink::route('/{record}/edit'),
        ];
    }
}
