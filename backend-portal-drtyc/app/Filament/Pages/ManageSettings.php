<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms;
use Filament\Schemas;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;
use BackedEnum;

class ManageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Cog6Tooth;

    protected static ?string $navigationLabel = 'Configuración Global';

    protected static ?string $title = 'Configuración Global';

    protected static string|UnitEnum|null $navigationGroup = 'Sistema';

    protected static ?int $navigationSort = 10;

    protected string $view = 'filament.pages.manage-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        $this->form->fill([
            'institution_name' => $settings['institution_name'] ?? '',
            'director_name' => $settings['director_name'] ?? '',
            'phone' => $settings['phone'] ?? '',
            'email' => $settings['email'] ?? '',
            'address' => $settings['address'] ?? '',
            'facebook_url' => $settings['facebook_url'] ?? '',
            'youtube_url' => $settings['youtube_url'] ?? '',
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Schemas\Components\Tabs::make('settings')
                    ->schema([
                        Schemas\Components\Tabs\Tab::make('general')
                            ->label('Información General')
                            ->icon(Heroicon::BuildingOffice2)
                            ->schema([
                                Forms\Components\TextInput::make('institution_name')
                                    ->label('Nombre de la Institución')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('director_name')
                                    ->label('Nombre del Director')
                                    ->required()
                                    ->maxLength(255),
                            ])->columns(2),

                        Schemas\Components\Tabs\Tab::make('contact')
                            ->label('Contacto')
                            ->icon(Heroicon::Phone)
                            ->schema([
                                Forms\Components\TextInput::make('phone')
                                    ->label('Teléfono Principal')
                                    ->tel()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('email')
                                    ->label('Correo Institucional')
                                    ->email()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('address')
                                    ->label('Dirección Física')
                                    ->maxLength(255),
                            ])->columns(2),

                        Schemas\Components\Tabs\Tab::make('social')
                            ->label('Redes Sociales')
                            ->icon(Heroicon::GlobeAlt)
                            ->schema([
                                Forms\Components\TextInput::make('facebook_url')
                                    ->label('URL de Facebook')
                                    ->url()
                                    ->maxLength(255)
                                    ->placeholder('https://facebook.com/tu-pagina'),
                                Forms\Components\TextInput::make('youtube_url')
                                    ->label('URL de YouTube')
                                    ->url()
                                    ->maxLength(255)
                                    ->placeholder('https://youtube.com/@tu-canal'),
                            ])->columns(2),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => 'string']
            );
        }

        Notification::make()
            ->title('Configuración guardada')
            ->body('Los cambios se han guardado exitosamente.')
            ->success()
            ->send();
    }
}
