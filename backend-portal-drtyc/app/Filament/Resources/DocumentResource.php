<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DocumentResource\Pages;
use App\Models\Document;
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

class DocumentResource extends Resource
{
    protected static ?string $model = Document::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentDuplicate;

    protected static ?string $navigationLabel = 'Documentos';

    protected static ?string $modelLabel = 'Documento';

    protected static ?string $pluralModelLabel = 'Documentos';

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'editor']) || auth()->user()->hasPermissionTo('view_any_document');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_document');
    }

    public static function canEdit($record): bool
    {
        return auth()->user()->hasPermissionTo('update_document');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()->hasPermissionTo('delete_document');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Información del Documento')->schema([
                    Forms\Components\TextInput::make('title')
                        ->label('Título')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Select::make('category_id')
                        ->label('Categoría')
                        ->relationship('category', 'name', modifyQueryUsing: fn ($query) => $query->where('type', 'document'))
                        ->searchable()
                        ->preload()
                        ->required(),
                    Forms\Components\TextInput::make('document_type')
                        ->label('Tipo de Documento')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('document_number')
                        ->label('Número de Documento')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('year')
                        ->label('Año')
                        ->numeric()
                        ->required()
                        ->minValue(1900)
                        ->maxValue(date('Y')),
                    Forms\Components\DatePicker::make('issue_date')
                        ->label('Fecha de Emisión')
                        ->required(),
                ])->columns(2),

                Section::make('Descripción')->schema([
                    Forms\Components\Textarea::make('description')
                        ->label('Descripción')
                        ->maxLength(1000)
                        ->rows(3)
                        ->columnSpanFull(),
                ]),

                Section::make('Archivo')->schema([
                    Forms\Components\FileUpload::make('file_path')
                        ->label('Archivo PDF')
                        ->directory('documents')
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
                Tables\Columns\TextColumn::make('document_type')
                    ->label('Tipo')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('document_number')
                    ->label('Número')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('year')
                    ->label('Año')
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Categoría')
                    ->sortable(),
                Tables\Columns\TextColumn::make('issue_date')
                    ->label('Fecha Emisión')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Autor')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('year')
                    ->label('Año')
                    ->options(fn () => Document::distinct()->pluck('year', 'year')->sort()->reverse()->toArray()),
                Tables\Filters\SelectFilter::make('document_type')
                    ->label('Tipo de Documento')
                    ->options(fn () => Document::distinct()->pluck('document_type', 'document_type')->sort()->toArray()),
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Categoría')
                    ->relationship('category', 'name'),
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
            'index' => Pages\ListDocuments::route('/'),
            'create' => Pages\CreateDocument::route('/create'),
            'edit' => Pages\EditDocument::route('/{record}/edit'),
        ];
    }
}
