function commProsPopup() {
    var url = window.base_url + '/admin/comm_pro';
    createModalAndLoadUrl('comm_pro_modal', window.please_wait_loader_html, url, function () { }, 'modal-xl');

}

function commProsSingle() {
    var url = window.base_url + '/admin/comm_pro_single?id=' + window.active_customer;
    createModalAndLoadUrl('comm_pro_single', window.please_wait_loader_html, url, function () { }, 'modal-xl');
}

function viewCommProsSingle(profile_id) {
    profile_id = profile_id ? profile_id : -1;
    var url = window.base_url + '/admin/view_comm_pro_single?id=' + window.active_customer + "&pro_id=" + profile_id;
    createModalAndLoadUrl('view_comm_pro_single', window.please_wait_loader_html, url, function () { }, 'modal-xl');

}

function commProList() {
    var url = window.base_url + '/admin/comm_pro_list';
    createModalAndLoadUrl('comm_pro_list', window.please_wait_loader_html, url, function () { }, 'modal-lg');
}
function manageCommPro() {
    var url = window.base_url + '/admin/manage_comm_pro';
    createModalAndLoadUrl('manage_comm_pro', window.please_wait_loader_html, url, function () { }, 'modal-xl', '', '', 'export');
}

function editCommPro(id, view = false) {
    var url = window.base_url + '/admin/edit_comm_pro?id=' + id + '&view=' + view;
    createModalAndLoadUrl('edit_comm_pro', window.please_wait_loader_html, url, function () { }, 'modal-xl');
}


function delCommPro(id) {
    var url = window.base_url + '/admin/del_comm_pro?id=' + id;
    Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to use this profile again. This might stop data scheduling of meter having this profile ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!"
    }).then((result) => {
        if (result.value) {
            ajx({
                url: url,
                type: 'post',
                success: function (data) {
                    Swal.fire(data.title, data.message, data.class);
                    $('#manage_comm_pro_table').DataTable().ajax.reload(null, false);
                }
            });
        }
    });
}

// function mapCommPro()
// {
//     var url = window.base_url + '/admin/map_comm_pro';
//     createModalAndLoadUrl('map_comm_pro', window.please_wait_loader_html, url, function () {
//     }, 'modal-md');
// }

function assignCommPro() {
    var url = window.base_url + '/admin/assign_comm_pro';
    createModalAndLoadUrl('assign_comm_pro', window.please_wait_loader_html, url, function () { }, 'modal-xl');
}
