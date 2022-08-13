// function dataSchedularPopup() {
//     var url = window.base_url + '/admin/schduler_settings?id=' + window.active_organization_id;
//     createModalAndLoadUrl('schduler_modal', window.please_wait_loader_html, url, function () {
//     });

// }

// function createScheduler() {
//     var url = window.base_url + '/admin/signle_schduler?action_id=1';
//     createModalAndLoadUrl('create_schduler', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');
// }

// function manageScheduler() {
//     var url = window.base_url + '/admin/manage_schduler';
//     createModalAndLoadUrl('manage_schduler', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');
// }


// function editScheduler(id) {
//     var url = window.base_url + '/admin/signle_schduler?action_id=2&id=' + id;
//     createModalAndLoadUrl('edit_schduler', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');
// }


function viewReportScheduler(id, modal) {
    modal = modal ? modal : "view_schduler";
    var url = window.base_url + '/admin/report_signle_schduler?action_id=0&id=' + id;
    createModalAndLoadUrl(modal, window.please_wait_loader_html, url, function () {
    }, 'modal-lg');
}

// function delScheduler(id) {
//     var url = window.base_url + '/admin/del_schduler?id=' + id;
//     Swal.fire({
//         title: "Are you sure?",
//         text: "All Jobs Assosited With This Schedule Will Be Terminted.",
//         icon: "error",
//         showCancelButton: true,
//         confirmButtonColor: '#DD6B55',
//         confirmButtonText: 'Yes, I am sure!',
//         cancelButtonText: "No, cancel it!"
//     },
//             function (isConfirm) {
//                 if (isConfirm) {
//                     ajx({
//                         url: url,
//                         type: 'post',
//                         success: function (data) {
//                             Swal.fire(data.title, data.message, data.class);
//                             $('#manage_sch_table').DataTable().ajax.reload(null, false);

//                         }
//                     });
//                 }
//             });
// }

// function assignSchedule() {
//     var url = window.base_url + '/admin/assign_schdule?id=' + window.active_organization_id;
//     createModalAndLoadUrl('assign_schdule', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');
// }


// function targetMeters(element) {

//     var form = $(element).closest('form');
//     var form_data = form.serialize();
//     var form_id = form.attr('id');
//     var ajax = ajx({
//         url: window.base_url + "/admin/target_meters",
//         type: 'post',
//         data: form_data
//     });
//     createModalAndLoadAjaxResponse("target_meters_modal_" + form_id, window.please_wait_loader_html, ajax);
// }


// function viewMeterSchedules() {
//     var url = window.base_url + '/admin/mer_schs';
//     createModalAndLoadUrl('view_mer_sch', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');

// }

// function assignSchedulesToMeter() {
//     var url = window.base_url + '/admin/schs_list';
//     createModalAndLoadUrl('unassigned_schs_list', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');

// }

// function runningJobsList() {
//     var url = window.base_url + '/admin/running_jobs_list?org_id=' + window.active_organization_id;
//     createModalAndLoadUrl('running_jobs_list', window.please_wait_loader_html, url, function () {
//     }, 'modal-xl');
// }

/*
 * CRUD for Report Scheduler
 */

function createReportScheduler() {
    var url = window.base_url + '/admin/report_signle_schduler?action_id=1';
    createModalAndLoadUrl('create_report_scheduler', window.please_wait_loader_html, url, function () {
    }, 'modal-lg');
}

function manageReportScheduler() {
    var url = window.base_url + '/admin/report_schs_list';
    createModalAndLoadUrl('manage_report_schduler', window.please_wait_loader_html, url, function () {
    }, 'modal-xl','', '', 'export');
}

function getReportSchedulerLog() {
    var url = window.base_url + '/admin/get_db_backup_schedule_log';
    createModalAndLoadUrl('get_report_schedule_log', window.please_wait_loader_html, url, function () {
    }, 'modal-xl');
}

// function editDBBackupScheduler(id) {
//     var url = window.base_url + '/admin/signle_schduler?action_id=2&id=' + id;
//     createModalAndLoadUrl('edit_db_backup_schduler', window.please_wait_loader_html, url, function () {
//     }, 'modal-lg');
// }

function viewReportScheduler(id, modal) {
    modal = modal ? modal : "view_report_schduler";
    var url = window.base_url + '/admin/report_signle_schduler?action_id=0&id=' + id;
    createModalAndLoadUrl(modal, window.please_wait_loader_html, url, function () {
    }, 'modal-lg');
}

function delReportScheduler(id) {
    var url = window.base_url + '/admin/report_del_schduler?id=' + id;
    Swal.fire({
        title: "Are you sure?",
        text: "All jobs assosited with this Schedule will be terminted.",
        icon: "error",
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
                    $('#assing_report_schs_table').DataTable().ajax.reload(null, false);
                }
            });
        }
    });
}
