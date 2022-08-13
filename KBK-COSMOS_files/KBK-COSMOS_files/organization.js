function uncheck_parent_and_children(tree_selector) {

    //$(tree_selector).jstree(true).settings.checkbox.three_state = false;

    $(tree_selector).on('changed.jstree', function(e, data) {



        // var tree = $(tree_selector);

        // if (data.instance.is_checked(data.node)) {
        //     uncheckParents(data.instance, data.node);
        //     uncheckChildren(data.instance, data.node);
        // }

    });

    function uncheckParents(tree_instance, node) {
        if (node == '#')
            return;

        parent_node = tree_instance.get_parent(node)


        tree_instance.uncheck_node(parent_node);

        uncheckParents(tree_instance, parent_node);
    }

    function uncheckChildren(tree_instance, node) {

        children = tree_instance.get_children_dom(node);

        $.each(children, function(index, child) {
            child_node = $(child).attr('id');

            tree_instance.uncheck_node(child_node);

            uncheckChildren(tree_instance, child_node);
        });







    }

}

function checkOrganizationsAssignedToUser(tree_selector, encrypted_root_node_id, encrypted_user_id, url, tree_id) {
    $(tree_selector).on('load_node.jstree', function(event, data) {

        $.ajax({
            url: url,
            type: 'get',
            data: { node_id: data.node.id == '#' ? encrypted_root_node_id : data.node.id, user_id: encrypted_user_id },
            success: function(data) {

                $('#selected_orgs_list_' + tree_id).empty();
                $.each(data, function(i, item) {
                    $(tree_selector).jstree(true).check_node(item.id);

                    if ($('#selected_orgs_list_' + tree_id + ' input[value="' + item.id + '"]').length == 0) { // to avoid duplicate
                        $('#selected_orgs_list_' + tree_id).append(
                            '<li>' +
                            '<p>' + item.name + '</p>' +
                            '<input type="hidden" name="selected_org_' + tree_id + '[]" value="' + item.id + '" >' +
                            '</li>'
                        );
                    }
                });

            },
            error: function(jqXHR, exception) {

                ajax_errors_sweetalert_func(jqXHR, exception);

            }
        });

    });
}

function getNodeFromData(data) {

	var obj = {'id': 0};
	if ( window.meter_pane_cat_label_right_clicked != null ) {
		obj['id'] = window.meter_pane_cat_label_right_clicked.data('onn-id');
	} else {
		var inst = $.jstree.reference(data.reference);
		if ( inst != null ) {
			obj = inst.get_node(data.reference);
		} else {
			obj = data;
		}
	}
console.log(obj);
    return obj;
}

function createOrg(data, tree) {
    node = getNodeFromData(data);

    createModalAndLoadUrl('create_org', window.please_wait_loader_html, tree.base_url_for_org_tree + '/create/' + node.id, null, 'modal-lg');
}

function editOrg(data, tree) {
    node = getNodeFromData(data);
    createModalAndLoadUrl('edit_org', window.please_wait_loader_html, tree.base_url_for_org_tree + '/' + node.id + '/edit', null, 'modal-lg');
}

function deleteOrg(data, tree) {
    node = getNodeFromData(data);
    treeObject = tree;
    treeReference = $.jstree.reference(data.reference);
    Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
		if (result.value) {
            ajx({
                type: 'post',
                data: { _method: 'DELETE' },
                url: treeObject.base_url_for_org_tree + "/" + node.id,
                success: function(data) {
                    if (data.success == true) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Organization has been deleted.",
                            icon: "success",
                            timer: 3000,
                        });

                        //$('#tree_{{$id}}').jstree("delete_node", node.id);
                        treeReference.delete_node(node);

                    } else if (data.success == false)
                        Swal.fire("Not deleted!", data.error, "error");
                },
                error: function(jqXHR, exception) {
                    ajax_errors_sweetalert_func(jqXHR, exception);
                }
            });
		}
    });
}

function connectionsList() {
    createModalAndLoadUrl(
        'connections_list',
        window.please_wait_loader_html,
        window.base_url + '/admin/connections_list?org_id=' + window.active_organization_id,
        function () { },
        'modal-lg',
        '',
        '',
        'export'
    );
}

function customersList() {

    createModalAndLoadUrl(
        'customers_list',
        window.please_wait_loader_html,
        window.base_url + '/admin/customers_list?org_id=' + window.active_organization_id,
        null,
        'modal-lg'
    );
}

function metersList() {

    createModalAndLoadUrl(
        'meters_list',
        window.please_wait_loader_html,
        window.base_url + '/admin/meters_list?org_id=' + window.active_organization_id,
        null,
        'modal-lg'
    );
}

function organizationsBulkImporter() {
    createModalAndLoadUrl(
        'organizations-bulk-importer',
        window.please_wait_loader_html,
        window.base_url + '/admin/organizations_bulk_importer',
        function() {},
        'modal-xl'
    );
}

function organizationsBulkImporterAdv() {
    createModalAndLoadUrl(
        'organizations-bulk-importer-adv',
        window.please_wait_loader_html,
        window.base_url + '/admin/organizations_bulk_importer_adv',
        function() {
            refreshActiveHierarchyTree();
        },
        'modal-xl'
    );
}

function addMuteReasonType() {
    createModalAndLoadUrl(
        'add_mute_reason',
        window.please_wait_loader_html,
        window.base_url + '/admin/alarms/add_meter_mute_reason_type',
        null,
        'modal-lg'
    );
}

function getEmailTemplateManagementUI() {
    createModalAndLoadUrl(
        'email_template_management',
        window.please_wait_loader_html,
        window.base_url + '/admin/email_templates_management',
        null,
        'modal-xl','', '', 'export'
    );
}

function getMessageActionGroupsUI() {
    createModalAndLoadUrl(
        'message_action_group_ui',
        window.please_wait_loader_html,
        window.base_url + '/admin/message_groups',
        null,
        'modal-xl','', '', 'export'
    );
}

function getMessageCustomerBindingUI() {
    createModalAndLoadUrl(
        'message_customers_binding',
        window.please_wait_loader_html,
        window.base_url + '/admin/message_group_customers_binding',
        null,
        'modal-xl','', '', 'export'
    );
}
