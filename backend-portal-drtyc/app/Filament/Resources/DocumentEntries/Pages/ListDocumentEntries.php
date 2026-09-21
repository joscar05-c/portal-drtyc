<?php

namespace App\Filament\Resources\DocumentEntries\Pages;

use App\Filament\Resources\DocumentEntries\DocumentEntryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDocumentEntries extends ListRecords
{
    protected static string $resource = DocumentEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
