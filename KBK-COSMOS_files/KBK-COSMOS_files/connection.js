function createCustomer(data, tree) {
	node = getNodeFromData(data);

	tree.refresh_on_modal_hide = false;

	createModalAndLoadUrl('create_conn_modal', window.please_wait_loader_html, window.base_url + '/admin/customers/create', function () {

	});

}

function attachMeter(reference_number) {
	createModalAndLoadUrl('attach-meter', window.please_wait_loader_html, window.base_url + '/admin/attach-meter/' + reference_number, function () { });
}

function orphanedCustomers() {
	createModalAndLoadUrl(
		'orphaned_customers_list',
		window.please_wait_loader_html,
		window.base_url + '/admin/orphaned_customers_list?org_id=' + window.active_organization_id,
		function () { },
		'modal-lg',
		'',
		'',
		'export'
	);
}

function orphanedMeters() {

	createModalAndLoadUrl(
		'orphaned_meters_list',
		window.please_wait_loader_html,
		window.base_url + '/admin/orphaned_meters_list',
		function () { },
		'modal-lg',
		'',
		'',
		'export'
	);
}

function showMeterModelsManagement() {
    createModalAndLoadUrl('meter_models_management', window.please_wait_loader_html, window.base_url + '/admin/meter_models', function() {}, 'modal-xl', '', '', 'export');
}

function createMeterModel() {
    createModalAndLoadUrl(
		'create_meter_model',
		window.please_wait_loader_html,
		window.base_url + '/admin/meter_models/create',
		function() {},
		'modal-lg'
	);
}
