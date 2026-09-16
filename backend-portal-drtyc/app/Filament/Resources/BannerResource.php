<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
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

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Photo;

    protected static ?string $navigationLabel = 'Banners';

    protected static ?string $modelLabel = 'Banner';

    protected static ?string $pluralModelLabel = 'Banners';

    protected static string|UnitEnum|null $navigationGroup = 'Contenido';

    protected static ?int $navigationSort = 1;

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_banner');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_banner');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_banner');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_banner');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información del Banner')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Título')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('url')
                            ->label('URL')
                            ->url()
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

                Section::make('Contenido de Texto')
                    ->schema([
                        Forms\Components\TextInput::make('badge')
                            ->label('Badge')
                            ->placeholder('Ej: COMUNICADO OFICIAL')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->label('Descripción')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Texto descriptivo que aparece debajo del título en el carrusel'),
                    ])->columns(1),

                Section::make('Acción del Botón')
                    ->schema([
                        Forms\Components\TextInput::make('button_text')
                            ->label('Texto del Botón')
                            ->placeholder('Ej: Ver más detalles')
                            ->maxLength(255),
                        Forms\Components\Select::make('button_icon')
                            ->label('Icono del Botón')
                            ->allowHtml()
                            ->options([
                                'arrow_forward' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">arrow_forward</span> <span>Flecha hacia adelante</span></div>',

                                'download' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">download</span> <span>Descargar Archivo</span></div>',

                                'pin_drop' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">pin_drop</span> <span>Ubicación / Mapa</span></div>',

                                'app_registration' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">app_registration</span> <span>Trámite / Celular</span></div>',

                                'engineering' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">engineering</span> <span>Obra / Ingeniería</span></div>',

                                'cell_tower' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">cell_tower</span> <span>Telecomunicaciones</span></div>',

                                'event_available' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">event_available</span> <span>Cita / Disponible</span></div>',

                                'how_to_reg' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">how_to_reg</span> <span>Registro de Usuario</span></div>',

                                'picture_as_pdf' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">picture_as_pdf</span> <span>Documento PDF</span></div>',

                                'campaign' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">campaign</span> <span>Campaña / Megáfono</span></div>',

                                'info' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">info</span> <span>Información</span></div>',

                                'open_in_new' => '<div class="flex items-center gap-2"><span class="material-symbols-outlined text-gray-500" style="font-family: \'Material Symbols Outlined\' !important;">open_in_new</span> <span>Abrir en nueva ventana</span></div>',
                            ])
                            ->placeholder('Seleccionar icono...')
                            ->searchable()
                            ->helperText('Nombre del icono Material Symbols'),
                    ])->columns(2),

                Section::make('Imagen')
                    ->schema([
                        Forms\Components\FileUpload::make('image_path')
                            ->label('Imagen del Banner')
                            ->disk('public')
                            ->image()
                            ->imageEditor()
                            ->directory('banners')
                            ->maxSize(20000)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->required()
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
                    ->label('Título')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('badge')
                    ->label('Badge')
                    ->searchable()
                    ->limit(20),
                Tables\Columns\TextColumn::make('url')
                    ->label('URL')
                    ->limit(30)
                    ->copyable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Orden')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean()
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
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
