<?php

namespace App\Filament\Resources\JobCallResource\Pages;

use App\Filament\Resources\JobCallResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListJobCalls extends ListRecords
{
    protected static string $resource = JobCallResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
