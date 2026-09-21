<?php

namespace App\Filament\Resources\DocumentEntries\Pages;

use App\Filament\Resources\DocumentEntries\DocumentEntryResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditDocumentEntry extends EditRecord
{
    protected static string $resource = DocumentEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
