// jQuery(function($) {
    $("a[data-action]").click(function() {

        var act = $(this).data('action');
        eval(act);
        return false;
    });

    function manageCriticalAlarms() {
        createModalAndLoadUrl('create_critical_alarms_modal', window.please_wait_loader_html, window.base_url + '/admin/alarms/listing', function() {

        });
    }

    function manageMenus() {
        createModalAndLoadUrl('create_critical_alarms_modal', window.please_wait_loader_html, window.base_url + '/admin/menus/listing', function() {}, 'modal-xl','', '', 'export');
    }

    function generalSettings() {
        createModalAndLoadUrl('general_settings_modal', window.please_wait_loader_html, window.base_url + '/admin/settings/list-general-settings', function() {}, 'modal-lg');
    }

    function manageUsers() {
        createModalAndLoadUrl('manage_users_modal', window.please_wait_loader_html, window.base_url + '/admin/access/user-listing', function() {

        }, 'modal-xl','', '', 'export');
    }

    function manageRoles() {
        createModalAndLoadUrl('manage_roles_modal', window.please_wait_loader_html, window.base_url + '/admin/access/role-listing', function() {

        }, 'modal-lg','', '', 'export');
    }

    function managePermissions() {
        createModalAndLoadUrl('manage_permissions_modal', window.please_wait_loader_html, window.base_url + '/admin/access/permission-listing', function() {

        }, 'modal-xl','', '', 'export');
    }

    function manageGovDepartments() {
        createModalAndLoadUrl('manage_gov_departments_modal', window.please_wait_loader_html, window.base_url + '/admin/gov_departments', function() {}, 'modal-xl','', '', 'export');
    }

    function getCreateDeparmentUI() {
        createModalAndLoadUrl('create_gov_department_modal', window.please_wait_loader_html, window.base_url + '/admin/gov_departments/create', function() {}, 'modal-xl');
    }

	function manageTariffs() {
        createModalAndLoadUrl('manage_taiffs_modal', window.please_wait_loader_html, window.base_url + '/admin/tariffs', function() {}, 'modal-xl','', '', 'export');
    }

    function getCreateTariffUI() {
        createModalAndLoadUrl('create_tariff_modal', window.please_wait_loader_html, window.base_url + '/admin/tariffs/create', function() {}, 'modal-xl');
    }

	function manageManufacturers() {
        createModalAndLoadUrl('manage_manufacturers_modal', window.please_wait_loader_html, window.base_url + '/admin/manufacturers', function() {}, 'modal-xl', '', '', 'export');
    }

    function getCreateManufacturerUI() {
        createModalAndLoadUrl('create_manufacturer_modal', window.please_wait_loader_html, window.base_url + '/admin/manufacturers/create', function() {}, 'modal-lg');
    }

	function manageProjects() {
		createModalAndLoadUrl('manage_projects_modal', window.please_wait_loader_html, window.base_url + '/admin/projects', function() {}, 'modal-xl', '', '', 'export');
	}

	function getCreateProjectUI() {
        createModalAndLoadUrl('create_project_modal', window.please_wait_loader_html, window.base_url + '/admin/projects/create', function() {}, 'modal-lg');
    }
// });
