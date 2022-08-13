var is_editing_item = false;
// var associated = $("select[name='associated-permissions']");
// var associated_container = $("#available-permissions");

// if (associated.val() == "custom") {
//     associated_container.removeClass('hidden');
// } else {
//     associated_container.addClass('hidden');
// }

(function($) {
	$(function() {
		$(document).on('change', "select[name='associated-permissions']", function() {
		    if ($(this).val() == "custom") {
		        $("#available-permissions").removeClass('hidden');
		        //$(".parent-checkbox, .child-checkbox").prop('checked', false);
		    } else {
		        $("#available-permissions").addClass('hidden');
		        //$(".parent-checkbox, .child-checkbox").prop('checked', true);
		    }
		});

		$(document).on("click", ".parent-checkbox", function() {
			$(this).parents("ul").find(".child-checkbox, .sub-parent-checkbox").prop('checked', $(this).is(":checked")).trigger('change');
		});

		$(document).on("click", ".sub-parent-checkbox", function() {
			if ($(this).is(":checked")) {
				$(this).parents("ul").parents("ul").find(".parent-checkbox").prop('checked', $(this).is(":checked")).trigger('change');
			}
			$(this).parent().parent().find(".child-checkbox").prop('checked', $(this).is(":checked")).trigger('change');
		});

		$(document).on("click", ".child-checkbox", function() {
		    if ($(this).is(":checked")) {
		        $(this).parents(".list-group").eq(0).parent().find(".sub-parent-checkbox").prop('checked', $(this).is(":checked")).trigger('change');
		        $(this).parents("ul").parents("ul").find(".parent-checkbox").prop('checked', $(this).is(":checked")).trigger('change');
		    }
		});

		$(document).on("click", ".listing-wrapper .btn-edit", function() {
		    var data = JSON.parse($(this).find('span').html());
		    if (typeof data.id != "undefined") {
		        var form = $(".create-item-form");
		        form.append('<input type="hidden" name="id" value="' + data.id + '">');
		        loadItemDataInForm(form, data);
		        switchItemView('form');
		        is_editing_item = true;
		    }
		});

		$(document).on("click", ".manage-listing-wrapper .btn-create-item", function() {
		    if (is_editing_item) {
		        Swal.fire({
		            title: "Warning",
		            text: "Do you really want to cancel editing?",
		            icon: "warning",
		            showCancelButton: true,
		            cancelButtonText: "Cancel",
		            confirmButtonColor: "#DD6B55",
		            confirmButtonText: "Yes, I do."
				}).then((result) => {
					if (!result.value) {
		                return false;
		            } else {
		                callResetForm();
		                is_editing_item = !is_editing_item;
		                return false;
		            }
		        });
		    } else {
		        switchItemView('form');
		    }
		    return false;
		});

		$(document).on("click", ".manage-listing-wrapper .btn-cancel-item-form", function() {
		    if (is_editing_item) {
		        confrimEditingThenSwitch('all-listing');
		    } else {
		        callResetForm();
		        is_editing_item = false;
		        switchItemView('all-listing');
		        return false;
		    }
		    return false;
		});

		$(document).on("click", ".manage-listing-wrapper .btn-all-listing", function() {
		    if (is_editing_item) {
		        confrimEditingThenSwitch('all-listing');
		    } else {
		        switchItemView('all-listing');
		    }
		    return false;
		});
	});
})(jQuery);

function confrimEditingThenSwitch(view) {
    Swal.fire({
        title: "Warning",
        text: "Do you really want to cancel editing?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, I do."
    }).then((result) => {
		if (!result.value) {
            return false;
        } else {
            callResetForm();
            is_editing_item = false;
            switchItemView(view);
            return false;
        }
    });
}

function callResetForm() {
    if (typeof resetItemForm === 'function') {
        resetItemForm();
    }
}

function switchItemView(view) {
    if (view == 'form') {
        $(".manage-listing-wrapper .view-wrapper").addClass('hidden');
        $(".manage-listing-wrapper .listing-wrapper").addClass('hidden');
        $(".manage-listing-wrapper .create-item-wrapper").removeClass('hidden');
    } else {
        $(".manage-listing-wrapper .view-wrapper").addClass('hidden');
        $(".manage-listing-wrapper .create-item-wrapper").addClass('hidden');
        $(".manage-listing-wrapper .listing-wrapper").removeClass('hidden');
        //$( "#" + $(".manage-listing-wrapper .listing-wrapper").find("table.dataTable").attr('id') ).DataTable().ajax.reload();
        var table = $("#" + $(".manage-listing-wrapper .listing-wrapper").find("table.dataTable").attr('id')).DataTable();
        var info = table.page.info();
        table.page(info.page).draw('page');
    }
}

function confirm_item_deletion(elem) {
    var form = $(elem).find('form');
    var link = $('a[data-method="delete"]');
    var cancel = (link.attr('data-trans-button-cancel')) ? link.attr('data-trans-button-cancel') : "Cancel";
    var confirm = (link.attr('data-trans-button-confirm')) ? link.attr('data-trans-button-confirm') : "Yes, delete";
    var title = (link.attr('data-trans-title')) ? link.attr('data-trans-title') : "Warning";
    var text = (link.attr('data-trans-text')) ? link.attr('data-trans-text') : "Are you sure you want to delete this item?";

    Swal.fire({
        title: title,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: cancel,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: confirm,
    }).then((result) => {
  		if (result.value) {
            now_delete_item(form, elem);
        }
    });
}

function delete_this_item(elem) {
    var cnfrm = confirm_item_deletion(elem);
}

function now_delete_item(frm, elem) {
    request = ajx({
        type: 'post',
        url: frm.attr('action'),
        async: true,
        data: frm.serialize(),
    });

    request.done(function(data) {
        if (data.success == true) {

            Swal.fire({
                title: "Deleted Successfully!",
                html: data.msg,
                icon: "success",
                timer: 3000,
            });

            //$("#create-alarm").reset();
            $(".manage-listing-wrapper .create-item-wrapper").addClass('hidden');
            $(".manage-listing-wrapper .listing-wrapper").removeClass('hidden');
            //$( "#" + $(elem).parents("table.dataTable").attr('id') ).DataTable().ajax.reload();
            var table = $("#" + $(elem).parents("table.dataTable").attr('id')).DataTable();
            var info = table.page.info();
            table.page(info.page).draw('page');
        } else {
            Swal.fire("Error!", data.msg, "error");
        }
    });
    request.fail(function(jqXHR, exception) {
        ajax_errors_sweetalert_func(jqXHR, exception);
    });
}
