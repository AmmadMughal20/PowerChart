function getCreateDeparmentUI()
{
    var url = window.base_url + '/admin/gov_departments/create';
    createModalAndLoadUrl('department_modal', window.please_wait_loader_html, url, function () {}, 'modal-lg');
}

function deparmentSingle()
{
    var url = window.base_url + '/admin/department_single?id=' + window.active_customer;
    createModalAndLoadUrl('department_single', window.please_wait_loader_html, url, function () {}, 'modal-lg');
}

function viewDeparmentSingle(profile_id)
{
    profile_id = profile_id ? profile_id : -1;
    var url = window.base_url + '/admin/view_department_single?id=' + window.active_customer + "&pro_id=" + profile_id;
    createModalAndLoadUrl('view_department_single', window.please_wait_loader_html, url, function () {}, 'modal-lg');
}

function deparmentList()
{
    var url = window.base_url + '/admin/department_list';
    createModalAndLoadUrl('department_list', window.please_wait_loader_html, url, function () {}, 'modal-lg');
}

function getManageDeparmentsUI()
{
    var url = window.base_url + '/admin/manage_department';
    createModalAndLoadUrl('manage_department', window.please_wait_loader_html, url, function () {}, 'modal-lg');
}

function editDeparment(id)
{
    var url = window.base_url + '/admin/edit_department?id=' + id;
    createModalAndLoadUrl('edit_department', window.please_wait_loader_html, url, function () {}, 'modal-md');
}

function delDeparment(id)
{
    var url = window.base_url + '/admin/del_department?id=' + id;
    Swal.fire(
		{
	        title: "Are you sure?",
	        text: "You will not be able to use this profile again. This might stop data scheduling of meter having this profile ",
	        icon: "warning",
	        showCancelButton: true,
	        confirmButtonColor: '#DD6B55',
	        confirmButtonText: 'Yes, I am sure!',
	        cancelButtonText: "No, cancel it!",
		}).then((result) => {
			if (result.value) {
                ajx({
                    url: url,
                    type: 'post',
                    success: function (data) {
                        Swal.fire(data.title, data.message, data.class);
                        $('#manage_department_table').DataTable().ajax.reload(null, false);
                    }
                });
            }
        }
	);
}
