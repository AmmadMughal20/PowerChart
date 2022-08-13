function createMcoAmrToAmr(reference_number) {
    createModalAndLoadUrl('mco-amr-amr', window.please_wait_loader_html, window.base_url + '/admin/mcos/create/' + reference_number, function () { });
}

function createMcoAmrToManual(reference_number) {
    createModalAndLoadUrl('mco-amr-manual', window.please_wait_loader_html, window.base_url + '/admin/mcos/create/' + reference_number + '?type=amr-to-manual', function () { });
}

function createMcoManualToAmr(reference_number) {
    createModalAndLoadUrl('mco-manual-amr', window.please_wait_loader_html, window.base_url + '/admin/mcos/create/' + reference_number + '?type=manual-to-amr', function () { });
}

function createCustomerSCO(reference_number) {
    createModalAndLoadUrl('create-customer-sco', window.please_wait_loader_html, window.base_url + '/admin/customer-sco/create?ref=' + reference_number + '&org_id=' + window.active_organization_id, function () { });
}

function createSCO(data, tree) {
    node = getNodeFromData(data);
    tree.refresh_on_modal_hide = false;
    createModalAndLoadUrl('create-sco', window.please_wait_loader_html, window.base_url + '/admin/scos/create/' + node.id, function () { });
}

function createBulkSCO(data, tree) {
    node = getNodeFromData(data);
    tree.refresh_on_modal_hide = false;
    createModalAndLoadUrl('create-bulk-sco', window.please_wait_loader_html, window.base_url + '/admin/bulk-sco/create/' + node.id, function () { });
}

function cancelSCO(reference_number) {
    createModalAndLoadUrl('cancel-sco', window.please_wait_loader_html, window.base_url + '/admin/scos/cancel/' + reference_number, function () { });
}

function createTDCO(reference_number) {
    createModalAndLoadUrl('create-tdco', window.please_wait_loader_html, window.base_url + '/admin/tdcos/create/' + reference_number, function () { });
}

function createDCO_ER(reference_number) {
    createModalAndLoadUrl('create-dcoero', window.please_wait_loader_html, window.base_url + '/admin/dco_res/create/' + reference_number, function () { });
}

function createPDCO(reference_number) {
    createModalAndLoadUrl('create-pdco', window.please_wait_loader_html, window.base_url + '/admin/pdcos/create/' + reference_number, function () { });
}

function createRCO(reference_number) {
    createModalAndLoadUrl('create-rco', window.please_wait_loader_html, window.base_url + '/admin/rcos/create/' + reference_number, function () { });
}

function changeCustomerAttributes(reference_number) {
    createModalAndLoadUrl('change-customer-attributes', window.please_wait_loader_html, window.base_url + '/admin/change_attributes/create/' + reference_number, function () { });
}

function transferCustomers(data, tree) {
    node = getNodeFromData(data);
    tree.refresh_on_modal_hide = false;
    createModalAndLoadUrl('transfer_consumers', window.please_wait_loader_html, window.base_url + '/admin/transfer_customers/create/' + node.id, function () { });
}

function showWorkflowListing(url_slug) {
    createModalAndLoadUrl(url_slug, window.please_wait_loader_html, window.base_url + '/admin/' + url_slug + '?org_id=' + window.top_organization_id, function () { }, 'modal-xl');
}

function organizationsManagment() {
    createModalAndLoadUrl('organizationsManagment', window.please_wait_loader_html, window.base_url + '/admin/organizations', function () { });
}

function discosManagement() {
    createModalAndLoadUrl('discos-management', window.please_wait_loader_html, window.base_url + '/admin/disco', function () { });
}

function getCreateDiscoUI(url) {
    createModalAndLoadUrl('create-disco', window.please_wait_loader_html, window.base_url + '/admin/disco/create', function () { }, 'modal-sm');
}
function bulkHierarchyTransfer() {
    createModalAndLoadUrl('bulk-hierarchy-transfer', window.please_wait_loader_html, window.base_url + '/admin/bulk-hierarchy-transfer?org_id=' + window.active_organization.id, function () { });
}
function bulkSyncWithIBS() {
    createModalAndLoadUrl('bulk-sync-with-ibs', window.please_wait_loader_html, window.base_url + '/admin/bulk-sync-with-ibs?org_id=' + window.active_organization.id, function () { });
}
function bulkMCO() {
    createModalAndLoadUrl('bulk-mco', window.please_wait_loader_html, window.base_url + '/admin/bulk-mco?org_id=' + window.active_organization.id, function () { });
}


function exportMonthlyBilling(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }

    createModalAndLoadUrl('export_monthly_billing', window.please_wait_loader_html, window.base_url + '/admin/export_monthly_billing/get_ui/' + node_id, function () { });
}

function doImportCustomers(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }
    createModalAndLoadUrl('do_import_customers', window.please_wait_loader_html, window.base_url + '/admin/do_import_customers/get_ui/' + node_id, function () { });
}

function doImportAPMS(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }
    createModalAndLoadUrl('do_import_apms', window.please_wait_loader_html, window.base_url + '/admin/do_import_apms/get_ui/' + node_id, function () { });
}

function doTransferCustomersImport() {
    createModalAndLoadUrl('doTransferCustomersImport', window.please_wait_loader_html, window.base_url + '/admin/do_transfer_customers_import/get_ui', function () { });
}

function importMeterInstallationPics() {
    createModalAndLoadUrl('importMeterInstallationPics', window.please_wait_loader_html, window.base_url + '/admin/import_meter_installation_pics/get_ui', function () { });
}

function doImportMasterFile(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }
    createModalAndLoadUrl('do_import_master_file', window.please_wait_loader_html, window.base_url + '/admin/do_import_master_file/get_ui/' + node_id, function () { });
}

function doImportMonthlyBilling(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }

    createModalAndLoadUrl('do_import_monthly_billing', window.please_wait_loader_html, window.base_url + '/admin/do_import_monthly_billing/get_ui/' + node_id, function () { });
}

function getEnergyAuditing(data) {

    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }
    if (node_id == 0) {
        Swal.fire(__("Error"), 'Kindly select an organization.', "error");
        return;
    }

    $("a[href='#energy-auditing']").trigger('click');
}

function getOnDemandReadMeterUI(data) {
    var node_id = 0;
    if (typeof data != "undefined") {
        node = getNodeFromData(data);
        node_id = node.id;
    } else {
        node_id = window.active_organization_id;
    }

    createModalAndLoadUrl('on_demand_read_meter', window.please_wait_loader_html, window.base_url + '/admin/on_demand_read_meter/get_ui/' + node_id, function () { });
}

function showWorkflowItem(id, url_slug) {
    createModalAndLoadUrl('show_' + url_slug, window.please_wait_loader_html, window.base_url + '/admin/' + url_slug + '/' + id, function () {
    });
}

function editWorkflowItem(id, url_slug) {
    createModalAndLoadUrl('edit' + url_slug, window.please_wait_loader_html, window.base_url + '/admin/' + url_slug + '/' + id + '/edit', function () { });
}

function editCriticalAlarmItem(id) {
    createModalAndLoadUrl('critical_alarm_management_edit', window.please_wait_loader_html, window.base_url + '/admin/critical_alarm_management/' + id + '/edit', function () { });
}

function deleteWorkflowItem(encrypted_id, url_slug, form_selector) {
    Swal.fire({
        title: "",
        text: __('Are you sure to delete?'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: __('Yes')
    }).then((result) => {
        if (result.value) {
            ajx({
                type: 'post',
                url: window.base_url + '/admin/' + url_slug + '/delete',
                data: { id: encrypted_id },
            }).done(function (data) {
                if (data.success == true) {
                    $(form_selector).parents('.modal').eq(0).modal('hide');
                    $('#listing_table').DataTable().draw();
                    swalAutoClose(__("Success"), data.message, "success");
                } else {
                    Swal.fire(__("Error"), data.message, "error");
                }
            }).fail(function (jqXHR, exception) {
                ajax_errors_sweetalert_func(jqXHR, exception);
            });
        }
    });
}

function restoreWorkflowItem(id, url_slug) {
    Swal.fire({
        title: "",
        text: __("Are you sure you want to restore this item?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: __("Yes"),
        cancelButtonText: __("No")
    }).then((result) => {
        if (result.value) {
            ajx({
                type: 'post',
                url: window.base_url + '/admin/' + url_slug + '/restore',
                data: { id: id },
            }).done(function (data) {
                if (data.success == true) {
                    $('#listing_table').DataTable().draw();
                    swalAutoClose('', data.message, "success");
                } else {
                    Swal.fire('', data.message, "error");
                }
            }).fail(function (jqXHR, exception) {
                ajax_errors_sweetalert_func(jqXHR, exception);
            });
        }
    });
}

function permanentDeleteWorkflowItem(id, url_slug) {
    Swal.fire({
        title: "",
        text: __("Are you sure you want to permanently delete this item?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: __("Yes"),
        cancelButtonText: __("No")
    }).then((result) => {
        if (result.value) {
            ajx({
                type: 'post',
                url: window.base_url + '/admin/' + url_slug + '/permanent_delete',
                data: { id: id },
            }).done(function (data) {
                if (data.success == true) {
                    $('#listing_table').DataTable().draw();
                    swalAutoClose('', data.message, "success");
                } else {
                    Swal.fire('', data.message, "error");
                }
            }).fail(function (jqXHR, exception) {
                ajax_errors_sweetalert_func(jqXHR, exception);
            });
        }
    });
}

function importMonthlyBillingCrossComparison() {
    createModalAndLoadUrl(
        'import_monthly_billing_cross_comparison',
        window.please_wait_loader_html,
        window.base_url + '/admin/import_monthly_billing_cross_comparison?org_id=' + window.active_organization_id,
        function () { },
        'modal-xl'
    );
}

function monthlyBillingImportSaved() {
    createModalAndLoadUrl(
        'mb_import_saved',
        window.please_wait_loader_html,
        window.base_url + '/admin/monthly_billing_saved_filter_view',
        function () { },
        'modal-md'
    );

}

function getCrossComparisonAvailbilityUI() {
    createModalAndLoadUrl(
        'get_cross_comparison_ui',
        window.please_wait_loader_html,
        window.base_url + '/admin/cross_comparison_availbility?org_id=' + window.active_organization_id,
        function () { },
        'modal-md'
    );
}

function manageMonthlyBillingSaveLock() {
    createModalAndLoadUrl('manage_monthly_billing_save_lock',
        window.please_wait_loader_html, window.base_url + '/admin/manage_monthly_billing_save_lock?org_id=' + window.active_organization_id, function () { }
    );
}

function exportMonthlyBillingCobol() {
    createModalAndLoadUrl('export_monthly_billing_cobol_form',
        window.please_wait_loader_html, window.base_url + '/admin/export_monthly_billing_cobol_form?org_id=' + window.active_organization_id, function () { }
    );
}

function exportMonthlyBillingCobolST() {
    createModalAndLoadUrl('export_monthly_billing_cobol_st_form',
        window.please_wait_loader_html, window.base_url + '/admin/export_monthly_billing_cobol_st_form?is_st=1&org_id=' + window.active_organization_id, function () { }
    );
}

function monthlyBillingExportTemplatesManagement() {
    createModalAndLoadUrl('mbl_export_templates', window.please_wait_loader_html, window.base_url + '/admin/mbl_export_templates', function () { }, 'modal-xl', '', '', 'export');
}

function monthlyBillingLockedView() {
    createModalAndLoadUrl('monthly_billing_locked_view',
        window.please_wait_loader_html, window.base_url + '/admin/monthly_billing_locked_view_form?org_id=' + window.active_organization_id, function () { }
    );
}

function monthlyBillingInitiazlizationModule() {
    createModalAndLoadUrl('monthly_billing_initialization_module',
        window.please_wait_loader_html, window.base_url + '/admin/monthly_billing_initialization_module_form?org_id=' + window.active_organization_id, function () { }
    );
}

function lockMonthlyBillingCobol() {
    createModalAndLoadUrl('lock_monthly_billing_cobol_form',
        window.please_wait_loader_html, window.base_url + '/admin/export_monthly_billing_cobol_form?org_id=' + window.active_organization_id + '&lock_only=1', function () { }
    );
}

function importMonthlyBillingCobol() {
    createModalAndLoadUrl('import_monthly_billing_cobol_form',
        window.please_wait_loader_html, window.base_url + '/admin/import_monthly_billing_cobol_form', function () { }
    );
}

function bulkChangeAttributes() {
    createModalAndLoadUrl('bulk-change-attributes',
        window.please_wait_loader_html, window.base_url + '/admin/bulk-change-attributes', function () { }
    );
}

function bulkDeviceCreationUI() {
    createModalAndLoadUrl('bulk-device-creation-ui',
        window.please_wait_loader_html, window.base_url + '/admin/bulk-device-creation/ui', function () { }
    );
}

// function bulkDeviceCreationForm() {
//     createModalAndLoadUrl('bulk-device-creation-form',
//         window.please_wait_loader_html, window.base_url + '/admin/bulk-meter-creation-form', function() {}
//     );
// }

function bulkCustomersShifting() {
    createModalAndLoadUrl('bulk-customers-shifting',
        window.please_wait_loader_html, window.base_url + '/admin/bulk-customers-shifting', function () { }
    );
}

function bulkReferenceNumberChange() {
    createModalAndLoadUrl('bulk-reference-number-change',
        window.please_wait_loader_html, window.base_url + '/admin/bulk-reference-number-change', function () { }
    );
}

function bulkCommunicationThresholds() {
    createModalAndLoadUrl('bulk-communication-thresholds',
        window.please_wait_loader_html, window.base_url + '/admin/bulk-communication-thresholds?org_id=' + window.active_organization_id, function () { }
    );
}
