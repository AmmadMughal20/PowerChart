jQuery.fn.bootstrapDP = jQuery.fn.datepicker.noConflict();
window.date_format = 'dd-M-yyyy';

/**
 * [__ Function to translate strings]
 * @return {[type]} [description]
 */
function __(str) {
    return str;
}

function createNewModal(btn, slug = null, data_table_id = null, modal_size = null, export_btn = null) {
    if (modal_size == null) {
        modal_size = 'modal-xl';
    }
    if (export_btn != null) {
        export_btn = 'export';
    }
    event.preventDefault();
    var url = $(btn).attr('href');
    createModalAndLoadUrl(slug, window.please_wait_loader_html, url, function () {
        $('#' + data_table_id).DataTable().ajax.reload(null, false); // user paging is not reset on reload
    }, modal_size, '', '', export_btn);
}

window.charts_datetime_labels_format = {
    day: '%e-%b-%Y',
    hour: '%H:%M',
    minute: '%H:%M',
}

window.charts_tooltip_format = {
    headerFormat: '<b>Date: </b> {point.x: %e-%b-%Y %I:%M:%p}<br>',
    pointFormat: '<b>{series.name}: </b>{point.y:.2f}'
}

function loadUrlInModal(modal, please_wait_html, url, selector_for_header, modal_title = null, has_export = null) {
    ajax_object = ajx({
        type: 'get',
        url: url,
        async: true,
    });
    loadAjaxResponseInModal(modal, please_wait_html, ajax_object, selector_for_header, modal_title, '', '', has_export)
}

function swalAutoClose(swal_title, swal_text, swal_type, swal_timer = 3000) {
    Swal.fire({
        title: swal_title,
        html: swal_text,
        icon: swal_type,
        timer: swal_timer,
    });
}

function loadAjaxResponseInModal(modal, please_wait_html, ajax_object, selector_for_header, modal_title = null, on_modal_hide = null, confirm_on_close = false, has_export = null) {
    modal.find('.modal-body').html('<div>' + trans("strings.Please wait") + '...</div>');
    modal.find('.modal-body').html(please_wait_html);
    modal.modal({
        'backdrop': 'static',
        'keyboard': false,
    });
    request = ajax_object;

    request.done(function (data) {        
        validateIfUnAuthenticated(data, function () {
            modal.find('.modal-body').empty();
            modal.find('.modal-body').html('<div>Please wait...</div>');
            modal.find('.modal-body *').fadeOut('slow', function () {

                if (data.success != undefined && data.success == false) {
                    // json error response
                    let msg = (data.message) ? data.message : data.msg;
                    let default_title = modal_title ? modal_title : 'Warning!';
                    let title = (data.title) ? data.title : default_title;
                    modal.find('.modal-header .modal-title').remove();
                    modal.find('.modal-header').prepend($('<h4 style="display:inline" class="modal-title">' + title + '</h4>'));
                    modal.find('.modal-body').html('<div class="alert alert-danger">' + msg + '</div>');
                } else {
                    modal.find('.modal-body').html(data);                    
                    // setTimeout(function() {
                    if (has_export != null && has_export != '') {                        
                        var buttons = '';
                        if(window.pdf == '1') {
                            buttons += '<a id="btn-export-pdf" data-toggle="tooltip" title="Export To pdf" data-placement="bottom" class="export-buttons" export="pdf"> <img src="' + base_url_2 + '/img/icon/pdf.png" class="export-icon-pdf export-buttons"> </a>';
                        }
                        if (window.excel == '1'){
                            buttons += '<a id="btn-export-excel" data-toggle="tooltip" title="Export To Excel" class="export-buttons" export="excel" data-placement="bottom"> <img src="' + base_url_2 + '/img/icon/excel.png" class="export-icon-excel export-buttons"> </a> <a id="btn-export-csv" data-toggle="tooltip" title="Export To CSV" class="export-buttons" export="csv" data-placement="bottom"> <img src="' + base_url_2 + '/img/icon/csv.png" class="export-icon-csv export-buttons"> </a>';
                        }                         
                        modal.find('.header-right-side').empty().prepend('<div style="display:inline; margin-right: 20px;">'+buttons+'</div>');
                    }
                    if (modal_title != null && modal_title != '') {
                        modal.find('.modal-header .modal-title').remove();
                        modal.find('.modal-header').prepend($('<h4 style="display:inline" class="modal-title">' + modal_title + '</h4>'));
                    } else {
                        if (!selector_for_header) {
                            selector_for_header = 'h4' // default tag for modal title
                        }

                        modal.find('.modal-header .modal-title').remove();
                        var header = $('<h4>Warning!</h4>');
                        if (modal.find('.modal-body ' + selector_for_header).length > 0) {
                            header = modal.find('.modal-body ' + selector_for_header)
                                .first()
                                .detach();
                        }
                        header.css('display', 'inline')
                            .addClass('modal-title')
                            .prependTo(modal.find('.modal-header').first());
                    }
                    // }, 100);
                    modal.find('.modal-body').fadeIn('slow');
                    modal.find('input,textarea').each(function () {
                        $(this).removeAttr('autocomplete');
                    });
                }
            });

        });

    });

    request.fail(function (jqXHR, exception) {
        ajax_errors_sweetalert_func(jqXHR, exception);
        modal.modal('hide');
    });

    if (confirm_on_close) {
        modal.find('.close').click(function (e) {
            e.stopPropagation();
            Swal.fire({
                title: trans('strings.Are you sure?'),
                text: trans("strings.All of your changes will be lost."),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: trans('strings.Yes, I confirm'),
            }).then((result) => {
                if (result.value) {
                    modal.modal('hide');
                }
            });
        });
    }

    modal.on('hidden.bs.modal', function () {
        if (on_modal_hide) {
            on_modal_hide();
        }
        modal.find('.modal-body').empty();
        modal = modal.unbind('hidden.bs.modal');
        modal.remove();
    });
}

function createModalAndLoadUrl(modal_name, please_wait_html, url, on_modal_hide, modal_class, selector_for_header, modal_title = null, has_export = null) {
    g_modal = createModal(modal_name, modal_class, has_export);
    g_modal.on('hidden.bs.modal', function () {
        if (on_modal_hide) {
            on_modal_hide();
        }
        g_modal = g_modal.unbind('hidden.bs.modal');
        $("#" + modal_name).remove();
    });

    g_modal.on('shown.bs.modal', function () {
        $(document).off('focusin.modal');
    });

    loadUrlInModal(g_modal, please_wait_html, url, selector_for_header, modal_title, has_export);
}

function createModalAndLoadAjaxResponse(modal_name, please_wait_html, ajax_object, on_modal_hide, modal_class, selector_for_header, modal_title = null, confirm_on_close = false, has_export = null) {
    modal = createModal(modal_name, modal_class);
    modal.on('shown.bs.modal', function () {
        $(document).off('focusin.modal');
    });
    loadAjaxResponseInModal(modal, please_wait_html, ajax_object, selector_for_header, modal_title, on_modal_hide, confirm_on_close, has_export);
}

var z_index_count = 18;
$(window).on('shown.bs.modal', function (e) {
    z_index_count += 5;
    $(e.target).css('z-index', z_index_count);
});

function createModal(modal_name, modal_class) {
    modal_class = typeof modal_class !== 'undefined' ? modal_class : 'modal-xl';
    var g_modal_id = modal_name;
    g_modal = $('body').find('#' + g_modal_id);
    if (!g_modal.length) {
        $('body').append(
            `
            <div id="` + g_modal_id + `" class="modal fade" role="dialog">
              <div class="modal-dialog ` + modal_class + `">
                <!-- Modal content-->
                <div class="modal-content">
                  <div class="modal-header">
                    <div class="pull-right">
                        <div style="display:inline;" class="header-right-side"> </div>
                        <button style="opacity: 1; color: lightgray;" type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                  </div>
                  <div class="modal-body">
                    <p>Some text in the modal.</p>
                  </div>
                </div>
              </div>
            </div>
            `
        );
    }
    g_modal = $('body').find('#' + g_modal_id);

    return g_modal;
}

function validateAndSubmitForm(Form_selector, Submit_button_selector, Locale) {
    var form_selector = Form_selector;
    var submit_button_selector = Submit_button_selector;
    var locale = Locale;

    $(form_selector).validate({
        ignore: "",
        lang: locale,
        // errorPlacement: function(error, element) {
        //   error.insertAfter($(element).closest('.input-group')); //So i putted it after the .form-group so it will not include to your append/prepend group.
        // },
        highlight: function (element) {
            console.log(element);
            //$(element).closest('.form-group').addClass('has-error');
            $(element).addClass('has-error');
            var input_group = $(element).closest('.input-group')

            if (input_group.length != 0) {
                input_group.addClass('has-error');
            }
        },
        unhighlight: function (element) {
            //$(element).closest('.form-group').removeClass('has-error');

            $(element).removeClass('has-error');
            var input_group = $(element).closest('.input-group')

            if (input_group.length != 0) {
                if (input_group.find('.has-error').length == 0)
                    input_group.removeClass('has-error');
            }
        }
    });

    // $(form_selector + ' input').change(function(){
    //   $(this).valid();
    // });

    // $(document).off('click', submit_button_selector);
    // $(document).on('click', submit_button_selector, function(){
    $(submit_button_selector).click(function () {

        $(form_selector + " input, " + form_selector + " select").each(function () {
            if ($(this).valid() == false) {
                var id = $(this).parents(".tab-pane").attr("id");

                var current_input = $(this);
                setTimeout(function () { current_input.focus(); }, 1000);

                $("ul.nav-tabs").find("li a[href='#" + id + "']").tab("show");

                var current_input = $(this);
                setTimeout(function () { current_input.focus(); }, 1000);

                return false; //break the loop
            }
        });


        $(form_selector + " input, " + form_selector + " select").each(function () {
            if ($(this).valid() == false) {
                $(this).focus();

                return false; //break the loop
            }
        });


        if ($(form_selector).valid() == true) {
            $(form_selector).submit();
        }

    });

    // $(submit_button_selector).click(function(){
    //   //alert('a');

    //   $( form_selector + " input, " + form_selector + " select").each(function(){
    //     if($(this).valid() == false)
    //     {
    //       var id = $(this).parents(".tab-pane").attr("id");

    //       var current_input = $(this);
    //         setTimeout(function( ){ current_input.focus(); }, 1000);

    //       $("ul.nav-tabs").find("li a[href='#" + id + "']").tab("show");

    //        var current_input = $(this);
    //         setTimeout(function( ){ current_input.focus(); }, 1000);

    //         return false; //break the loop
    //       }
    //   });


    //   $(form_selector + " input, " + form_selector + " select").each(function(){
    //     if($(this).valid() == false)
    //     {
    //       $(this).focus();

    //         return false; //break the loop
    //       }
    //   });


    //   if( $(form_selector).valid() == true)
    //   {
    //     $(form_selector).submit();
    //   }

    // });
}



/**
 * [getPinAndCallFunction  this function will ask user to enter his pin code and then call the callback function.]
 *
 * Example: getPinAndCallFunction(alert) will call alert(<user_entered_pin>)
 * Example: getPinAndCallFunction(function(pin) { usePin(pin); } );
 *
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getPinAndCallFunction(callback, onCancelCallback) {

    if (!callback) {
        alert(trans('strings.Please define callback function'));
        return;
    }

    Swal.fire({
        title: trans('strings.Pin Code Security'),
        text: trans('strings.Enter Pin Code'),
        input: "password",
        showCancelButton: true,
        allowOutsideClick: false,
        inputAttributes: {
            'autocomplete': false,
            'readonly': true,
            'onfocus': "if (this.hasAttribute('readonly')) {this.removeAttribute('readonly');this.blur();this.focus();}"
        },
        inputValidator: (value) => {
            if (!value) {
                return trans('strings.Please enter Pin Code.');
            }
        },
        onOpen: (modal) => {
            $(modal).find(".swal2-input").focus();
        },
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            if (typeof onCancelCallback !== 'undefined') {
                onCancelCallback();
            }
            return false;
        }

        callback(result.value);
    });

}

function secondsToHumanTime(seconds) {

    if (seconds < 0 || isNaN(seconds)) {
        return '-';
	} else if (seconds < 1) {
		return 'Less then 1 sec';
	}

    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'mins'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'secs'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if (levels[i][0] === 0) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
    };
    return returntext.trim();
}

function showMeterPics(id) {
    createModalAndLoadUrl('meter_pics', window.please_wait_loader_html, window.base_url + '/admin/show_meter_pics/' + id, function () { }, 'modal-lg');
}

function downloadAjaxFile(response, status, xhr) {
    var filename = "";
    var disposition = xhr.getResponseHeader('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
    }

    var type = xhr.getResponseHeader('Content-Type');
    var blob = new Blob([response], { type: type });

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var URL = window.URL || window.webkitURL;
        var downloadUrl = URL.createObjectURL(blob);

        if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
                window.location = downloadUrl;
            } else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            }
        } else {
            window.location = downloadUrl;
        }

        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    }
}

function generateTooltipContent(customer) {
    var content = '';

    if (customer.connection == null)
        return content;

    var connection = customer.connection;

    if (connection.meter != null && connection.meter.pic_1 != null) {
        var pic_name_parts = connection.meter.pic_1.split('.');

        var pic_1_100x100 = pic_name_parts[0] + '_100x100.' + pic_name_parts[1];
        // content += '<img style="cursor: pointer; width: 100%;" class="img-thumbnail" onclick="showMeterPics(' + connection.meter.id + ')" src="' + window.base_url + '/uploads/meter_pics/' + pic_1_100x100 + '">';
        content += '<img style="cursor: pointer; width: 100%;" class="img-thumbnail" onclick="showMeterPics(' + connection.meter.id + ')" src="' + window.base_url + '/cdn/' + connection.meter.pic_1 + '">';
    }

    content += '<br><br>';
    content += '<table class="table"><tr><td><b>' + __('Reference No.') + '</b></td><td>' + customer.reference_number + '</td></tr>';

    if (customer.connection.meter != null) {
        content += '<tr><td><b>' + __('MSN') + '</b></td><td>' + customer.connection.meter.msn + '</td></tr>';
        content += '<tr><td><b>' + __('Last Communication') + '</b></td><td>' + customer.connection.last_communication_time + '</td></tr>';
    }

    content += '</table>';

    return content;
}

function addComplain(ctr_id) {
    createModalAndLoadUrl('add_complain', window.please_wait_loader_html, window.base_url + '/admin/alarms/add_complain/' + ctr_id, function () { }, 'modal-xl');
}

function customerPicture(ctr_id) {
    createModalAndLoadUrl('customer_picture_form', window.please_wait_loader_html, window.base_url + '/admin/customer-picture-form/' + ctr_id, function () {
        if ($('.customer-info-tabs .active a').data('target') == '#info') {
            refreshActiveTab()
        }
    }, 'modal-md');
}
function meterPicture(ctr_id, imageType) {
    createModalAndLoadUrl('meter_picture_form', window.please_wait_loader_html, window.base_url + '/admin/meter-picture-form/' + ctr_id + "?image_type=" + imageType, function () {
        if ($('.customer-info-tabs .active a').data('target') == '#info') {
            refreshActiveTab()
        }
    }, 'modal-md');
}

function idCardPicture(ctr_id) {
    createModalAndLoadUrl('id_card_picture_form', window.please_wait_loader_html, window.base_url + '/admin/id-card-picture-form/' + ctr_id, function () {
        if ($('.customer-info-tabs .active a').data('target') == '#info') {
            refreshActiveTab()
        }
    }, 'modal-md');
}

function testBulkOperation() {
    createModalAndLoadUrl('test-bulk-operation', window.please_wait_loader_html, window.base_url + '/admin/test_bulk_operation?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulkCustomSMS() {
    createModalAndLoadUrl('bulk-custom-sms', window.please_wait_loader_html, window.base_url + '/admin/bulk-custom-sms?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulkTariffChange() {
    createModalAndLoadUrl('bulk-tariff-change', window.please_wait_loader_html, window.base_url + '/admin/bulk-tariff-change?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulkCreateVEEExceptions() {
    createModalAndLoadUrl('create-vee-exceptions', window.please_wait_loader_html, window.base_url + '/admin/vee_exceptions/create?org_id=' + window.active_organization_id, function () { }, 'modal-lg');
}

function bulkManageVEEExceptions() {
    createModalAndLoadUrl('manage-vee-exceptions', window.please_wait_loader_html, window.base_url + '/admin/vee_exceptions?org_id=' + window.active_organization_id, function () { }, 'modal-xl', '', '', 'export');
}

function db_logs(logType) {
    createModalAndLoadUrl('db_logs', window.please_wait_loader_html, window.base_url + '/admin/db_logs/' + logType + '?org_id=' + window.active_organization_id, function () { }, 'modal-xl', '', '', 'export');
}

function sm_eml(emailType) {
    createModalAndLoadUrl('get_emails', window.please_wait_loader_html, window.base_url + '/admin/get_emails/' + emailType + '?org_id=' + window.active_organization_id, function () { }, 'modal-xl', '', '', 'export');
}

function sm_sms(smsType) {
    createModalAndLoadUrl('get_sms', window.please_wait_loader_html, window.base_url + '/admin/get_sms/' + smsType + '?org_id=' + window.active_organization_id, function () { }, 'modal-xl', '', '', 'export');
}

function create_message_group_and_customer_binding() {
    createModalAndLoadUrl('create_message_group_and_customer_binding', window.please_wait_loader_html, window.base_url + '/admin/create_message_group_and_customer_binding?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function create_transformer(data, tree) {
    node = getNodeFromData(data);

    tree.refresh_on_modal_hide = false;

    createModalAndLoadUrl('create_transformer', window.please_wait_loader_html, window.base_url + '/admin/transformer/create/' + node.id, function () { });
}
function over_voltage_tripping() {
    createModalAndLoadUrl('over_voltage_tripping', window.please_wait_loader_html, window.base_url + '/admin/transformer/over_voltage_tripping?org_id=' + window.active_organization_id, function () { }, 'modal-lg');
}
/*
 * Disable console and show warning message.
 */
setTimeout(function () {
    console.log("%cWarning!!!", "font: 4em sans-serif; color: #f00;");
    console.log("%cThis may harm your computer and allow hackers to steal your confidential info like passwords.", "font: 2em sans-serif;");
}, 1);


// trigger datatable export button on export icons click
$(document).on('click', '.export-buttons', function (event) {
    var temp = $(this).attr("export");
    $("button.dt-button.buttons-" + temp + "", $(this).parents('.modal')).trigger('click');
});

function resetItemForm(id) {
    var form = $("#" + id);
    form.find("[name='id']").remove();
    if (typeof form[0] != "undefined") {
        form[0].reset();
    }
    form.closest('.modal').modal('hide');
}

function refreshDataTable(id) {

    if ($("#" + id).length > 0) {
        var table = $("#" + id).DataTable();
        var info = table.page.info();
        table.page(info.page).draw('page');
    }

}

function showRolePermissions(btn) {
    var url = $(btn).attr('href');
    createModalAndLoadUrl('edit_role', window.please_wait_loader_html, url, function () {
        $('#roles-table').DataTable().ajax.reload(null, false); // user paging is not reset on reload
    }, 'modal-xl');
}

function createNewRole(btn, type = false, hierarchy_level = null) {
    var url = $(btn).attr('href');
    if (type) {
        url = url + "?type=plug";
        if (hierarchy_level) {
            url += '&hierarchy_level=' + hierarchy_level
        }
    }

    createModalAndLoadUrl('create_new_role', window.please_wait_loader_html, url, function () {
        $('#roles-table').DataTable().ajax.reload(null, false); // user paging is not reset on reload
    }, 'modal-xl');
}

// function triggerRowClick(el, button) {
//     var getElement = $(el).children().find(button);
//     getElement[0].click();
//     //
// }
