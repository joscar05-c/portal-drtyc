<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $resources = ['post', 'document', 'category', 'user', 'role', 'banner', 'staff_member', 'job_posting', 'job_call', 'quick_link', 'procedure', 'project', 'office', 'complaint', 'faq', 'document_entry', 'area'];

        $permissions = [];
        foreach ($resources as $resource) {
            $permissions[] = Permission::firstOrCreate(['name' => "view_any_{$resource}", 'guard_name' => 'web']);
            $permissions[] = Permission::firstOrCreate(['name' => "view_{$resource}", 'guard_name' => 'web']);
            $permissions[] = Permission::firstOrCreate(['name' => "create_{$resource}", 'guard_name' => 'web']);
            $permissions[] = Permission::firstOrCreate(['name' => "update_{$resource}", 'guard_name' => 'web']);
            $permissions[] = Permission::firstOrCreate(['name' => "delete_{$resource}", 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo($permissions);

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->givePermissionTo($permissions);

        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $editor->givePermissionTo([
            'view_any_post', 'view_post', 'create_post', 'update_post', 'delete_post',
            'view_any_document', 'view_document', 'create_document', 'update_document', 'delete_document',
            'view_any_category', 'view_category', 'create_category', 'update_category', 'delete_category',
            'view_any_banner', 'view_banner', 'create_banner', 'update_banner', 'delete_banner',
            'view_any_staff_member', 'view_staff_member', 'create_staff_member', 'update_staff_member', 'delete_staff_member',
            'view_any_job_posting', 'view_job_posting', 'create_job_posting', 'update_job_posting', 'delete_job_posting',
            'view_any_job_call', 'view_job_call', 'create_job_call', 'update_job_call', 'delete_job_call',
            'view_any_quick_link', 'view_quick_link', 'create_quick_link', 'update_quick_link', 'delete_quick_link',
            'view_any_procedure', 'view_procedure', 'create_procedure', 'update_procedure', 'delete_procedure',
            'view_any_project', 'view_project', 'create_project', 'update_project', 'delete_project',
            'view_any_office', 'view_office', 'create_office', 'update_office', 'delete_office',
            'view_any_complaint', 'view_complaint', 'update_complaint', 'delete_complaint',
            'view_any_faq', 'view_faq', 'create_faq', 'update_faq', 'delete_faq',
            'view_any_document_entry', 'view_document_entry', 'create_document_entry', 'update_document_entry', 'delete_document_entry',
        ]);

        $mesaDePartes = Role::firstOrCreate(['name' => 'mesa_de_partes', 'guard_name' => 'web']);
        $mesaDePartes->givePermissionTo([
            'view_any_document_entry',
            'view_document_entry',
            'create_document_entry',
            'update_document_entry',
            'view_any_area',
            'view_area',
            'view_any_user',
            'view_user',
        ]);

        $especialista = Role::firstOrCreate(['name' => 'especialista', 'guard_name' => 'web']);
        $especialista->givePermissionTo([
            'view_any_document_entry',
            'view_document_entry',
            'update_document_entry',
            'view_any_area',
            'view_area',
        ]);

        Area::firstOrCreate(
            ['name' => 'Mesa de Partes'],
            ['description' => 'Área principal de recepción y trámite documentario', 'is_main_entry_point' => true]
        );

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@portal.drtyc'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
            ]
        );
        $adminUser->assignRole('super_admin');
    }
}
