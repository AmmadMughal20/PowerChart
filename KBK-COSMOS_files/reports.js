function submit_post_via_hidden_form(url, params) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    w = 1170;
    h = 768;
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    var winOption = 'menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=no,resizable=no,dependent,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',titlebar=no';
    var winRpt = 'winRpt_' + Math.random();
    var f = $("<form method='POST' style='display:none;'></form>").attr({
        action: url
    }).appendTo(document.body);

    for (var i in params) {
        if (params.hasOwnProperty(i)) {
            $('<input type="hidden" />').attr({
                name: i,
                value: params[i]
            }).appendTo(f);
        }
    }
    f.attr("target", winRpt);
    window.open(url, winRpt, winOption);
    //    windowShareef.moveTo(50, 100);
    f.submit();
    f.remove();
}

function closeModal(modal_id) {
    $('#' + modal_id).modal('hide');
}

function downloadReport(rpt, fmt) {
    var url = window.base_url + '/admin/download_report?rpt=' + rpt + '&fmt=' + fmt;
    window.open(url);
}

function downloadRequest(url) {
    ajx({
        url: url,
        type: 'get',
        success: function(data) {
            downloadReport(data['rpt'], data['fmt']);
        },
        error: function(jqXHR, exception) {
            ajax_errors_sweetalert_func(jqXHR, exception);
        }
    });
}

/**
 *
 * @param {type} report
 * @param {int} fmt
 * @returns {void} Render Consumer Related Reports
 */
function consumerReports(report, fmt) {
    fmt = fmt ? fmt : 1;
    var url = window.base_url + '/admin/consumer_reports?ctr_id=' + active_customer_id + '&rpt=' + report + "&fmt=" + fmt + "&ref_no=" + window.active_customer;
    ajx({
        type: 'get',
        url: url,
        success: function(data) {
            submit_post_via_hidden_form(data['url'], data['params']);
        }
    });
}
/**
 *
 * @param {string} report
 * @param {string} filter
 * @returns {void} Filter Options For Consumer Related Reports
 */
function consumerReportsWithFilters(report, filter) {
    var url = window.base_url + '/admin/consumer_reports_with_filters?rpt=' + report + '&filter=' + filter + '&ctr_id=' + active_customer_id + "&ref_no=" + window.active_customer;
    createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url, function() {}, 'modal-lg');
}

function exportMeteringDataReports(fmt) {
    var active_tab = customer_details_active_tab;
    var tab_val = $(active_tab).attr('href').replace("#", "");

    var start_date = customer_tab_start_date;
    var end_date = customer_tab_end_date;
    var url = window.base_url + '/admin/consumer_reports_with_filters?tab=' + tab_val + "&fmt=" + fmt + '&ctr_id=' + active_customer_id + "&ref_no=" + window.active_customer;
    url += "&range_start=" + start_date +"&range_end=" + end_date;
    if (tab_val == 'info' || tab_val == 'activity-log' || tab_val == 'comm-log') {
        var url = window.base_url + '/admin/consumer_reports?tab=' + tab_val + "&fmt=" + fmt + '&ctr_id=' + active_customer_id + "&ref_no=" + window.active_customer;
        //        downloadRequest(url);
        ajx({
            type:'get',
            url: url,
            success: function(data) {
                submit_post_via_hidden_form(data['url'], data['params']);
            }
        });
    } else {
        createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url, function() {}, 'modal-lg');
    }

}
/**
 * Organization related reports
 * @param {string} report
 * @param {int} fmt
 * @returns {void}
 */
function orgReports(report) {
    var url = window.base_url + '/admin/org_reports?id=' + window.active_organization_id + '&rpt=' + report;
    //    if (fmt == 1)
    //    {
    ajx({
        type: 'get',
        url: url,
        success: function(data) {
            submit_post_via_hidden_form(data['url'], data['params']);
        }
    });
}

/**
 * Organization related reports
 * @param {string} report
 * @param {int} fmt
 * @returns {void}
 */
function orgRpts(report, filter, options = '') {
    var url = window.base_url + '/admin/org_rpts?id=' + window.active_organization_id + '&rpt=' + report + '&filter=' + filter + '&options=' + options;
    createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url + "&org_id=" + window.active_organization_id, function() {}, 'modal-xl');
}

/**
 * Organization related reports
 * @param {string} report
 * @param {string} filter
 * filter parameter is encrypted string (using strEncrypt()) which contains 14 colon separated (0 or 1) values example 0:1:0:0:1:0:0:1:0:0:1:0
 * 0 means feature is off and 1
            0	Basic Filters
            1	Month
            2	Date Range
            3	MF Check
            4	Month Range
            5	Critical Alarms
            6	Range Slider
            7	Cross Cmp Filters
            8	Org Selection
            9	Dpt Selection
            10	Ref Selection
            11	Export Graph
            12	All Alarms
            13	On Demand Job Status
            14	CP Template
   @param {string} options is json object encrypted (using Laravel encrypt() strEncrypt() does not work correctly on json strings) string which contains options
 * @returns {void}
 */
function orgRptsBulkFilters(report, filter, options = '') {
    var url = window.base_url + '/admin/org_rpts_bulk_filters?id=' + window.active_organization_id + '&rpt=' + report + '&filter=' + filter + '&options=' + options;
    createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url + "&org_id=" + window.active_organization_id, function() {}, 'modal-lg');
}

/**
 *
 * @param {string} report
 * @param {string} filter
 * @returns {void}
 */
function orgReportsWithFilters(report, filter) {
    var url = window.base_url + '/admin/org_reports_with_filters?rpt=' + report + '&filter=' + filter + '&id=' + window.active_organization_id + "&org_lvl=" + active_hierarchy;
    createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url, function() {}, 'modal-lg');
}
/**
 *
 * @returns {exported report}
 */
function orgReportsWithFiltersProcessing(fmt) {
    var url = window.base_url + '/admin/download_org_reports_with_filters_processing?fmt=' + fmt;
    downloadRequest(url);
}

function consumerReportsWithFiltersProcessing(fmt) {
    var url = window.base_url + '/admin/consumer_reports_with_filters_processing?fmt=' + fmt;
    downloadRequest(url);
}

/**
 * Export currently opened report
 * @param {string} report
 * @param {int} fmt
 * @param {string} type
 * @returns {undefined}
 */
function exportReports(report, fmt, type) {
    if (type == 'org') {
        orgReports(report, fmt);
    } else if (type == 'ctr') {
        consumerReports(report, fmt)
    } else if (type == 'org-filters') {
        orgReportsWithFiltersProcessing(fmt);
    } else if (type == 'ctr-filters') {
        consumerReportsWithFiltersProcessing(fmt);
    } else if (type == 'mtr-tbs') {
        consumerReportsWithFiltersProcessing(fmt);
    }
}

function customReports() {
    var url = window.base_url + '/admin/custom_reports?id=' + window.active_organization_id + "&rpt=custom-rpt";
    createModalAndLoadUrl('custom_reports_filter', window.please_wait_loader_html, url + "&org_id=" + window.active_organization_id, function() {}, 'modal-lg');

}
// User Generated Report Templates
function createReportTemplate() {
    var url = window.base_url + '/admin/create_report_template';
    createModalAndLoadUrl('report_template', window.please_wait_loader_html, url + "?org_id=" + window.active_organization_id, function() {}, 'modal-xl');
}
function manageReportTemplate() {
    var url = window.base_url + '/admin/manage_template';
    createModalAndLoadUrl('manage_report_schduler', window.please_wait_loader_html, url, function () {}, 'modal-xl','', '', 'export');
}
function delRptTemplate(id) {
    var url = window.base_url + '/admin/del_rpt_template?id=' + id;
    Swal.fire({
        title: "Are you sure?",
        text: "All Jobs Assosited With This Schedule Will Be Terminted.",
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
                    swalAutoClose(data.title, data.message, data.class);
                    
                    $('#manage_template_table').DataTable().ajax.reload(null, false);

                }
            });
        }
    });
}

/**
 * Organization related reports
 * @param {string} report
 * @param {int} fmt
 * @returns {void}
 */
function customRptsBulkFilters(report, filter) {
    var url = window.base_url + '/admin/custom_rpts_bulk_filters?id=' + window.active_organization_id + '&rpt=' + report + '&filter=' + filter;
    createModalAndLoadUrl('show_report_with_filter_modal', window.please_wait_loader_html, url + "&org_id=" + window.active_organization_id, function() {}, 'modal-xl');
}

function laodRptColumns(type) {
    date_format = 'd-M-yyyy';    
    if (type == 'ctrs') {

        $(".mf-option").hide();
        $("#date-range").hide('fast');
        $("#month-range").hide('fast');
        $("#daily-date-range").hide('fast');

    } else if (type == 'mb') {
        $("#date-range").hide('fast');
        $("#daily-date-range").hide('fast');
        $("#month-range").show('fast');
        $(".mf-option").show();
    } else if (type == 'dr') { 
        $("#date-range").hide('fast');
        $("#daily-date-range").show('fast');
        $("#month-range").hide('fast');
        $(".mf-option").show();
    } else {
        $("#date-range").show('fast');
        $("#daily-date-range").hide('fast');
        $("#month-range").hide('fast');
        $(".mf-option").show();
    }
    ajx({
        url: 'fetch_rpt_cols',
        type: 'get',
        data: { rpt: type },
        success: function(data) {

            $("#rpt_cols").html(data);
            if (type == 'ctrs' || type == 'ed') {
                $(".mf-option").hide();
            }
        },
        error: function(jqXHR, exception) {
            ajax_errors_sweetalert_func(jqXHR, exception);
        }
    });
}

function clusterLogs()
{
    var url = window.base_url + '/admin/cluster_logs';
    createModalAndLoadUrl('cluster_logs', window.please_wait_loader_html, url + "?org_id=" + window.active_organization_id, function() {}, 'modal-xl','', '', 'export');


}
