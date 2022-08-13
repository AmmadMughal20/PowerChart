var js_tree_elem = $('#tree_1');
window.xhrNotificationsPool = [];

var is_first_time = true;
var customers_data = '';
var last_shown_page = 0;
var scrollTimer = -1;
var last_scroll_position = 0;
var customers_order_by = '';
var reached_at_end = false;
var is_show_all_customers = true;
var communication_status_filter = 'all';
var communication_status_sort_by = 'reference_number';
var is_customers_loaded = false;
var is_tariff_tab_loaded = false;
var filter_by_specific = '';
var filter_by_meter_type = '';
var is_communications_tab_loaded = false;
var is_org_selection_completed = false;
var is_load_org_tabs = true;
var is_org_pane_hidden = false;
var is_show_customer_from_critical_pane = false;
var is_transformer_searched = false;
var is_in_store = false;

function undoLastAction() {
	if ( window.active_organization.data.depth == 0 ) { return; }
	var active_org_id = window.active_organization_id;
	if ( $(".org-tabs").is(":visible") ) {
		active_org_id = window.active_organization.parent;
	}
	js_tree_elem.jstree("deselect_all");
	js_tree_elem.jstree(true).select_node(active_org_id);
}

function refreshActiveTab() {
    setCurrentCustomerTabActive();
    var $link = $('li.active a[data-toggle="tab"]:eq(0)');
    $link.parent().removeClass('active');
    var tabLink = $link.attr('href');
    var tab = $('a[href="' + tabLink + '"]:eq(0)');
    tab.tab('show');
}

function setCurrentCustomerTabActive() {
    $('.customer-tabs-container .nav-tabs li').removeClass('active');
    var activeTab = $('.customer-tabs-container .tab-pane.active');
    if (activeTab.length > 0) {
        var activeID = $(activeTab[0]).attr('id');
        $('.customer-tabs-container .nav-tabs li a[data-target="#' + activeID + '"]').parent().addClass('active');
    }
}

function showOnDemandJobResponse(id) {
    createModalAndLoadUrl('on-demand-job-response', window.please_wait_loader_html, window.base_url + '/admin/on-demand-job-response/' + id, function () { });
}

function CheckTabSize() {
    var ShownTabs = '.report-pane-container .nav-tabs li[style!="display: none;"]';
    var HiddenTabs = '.report-pane-container .nav-tabs li[style*="display: none;"]';

    //Get Tab Area
    var buttonWidth = $('.report-pane-container #nav-buttons').width();
    var tabAreaWidth = $('.report-pane-container .nav-tabs').width() - buttonWidth - 20;
    var tabWidths = 0;
    var firstHidden;

    //Add Up the Tabs' Widths
    $.each($(ShownTabs), function (idx, obj) {
        tabWidths += $(obj).outerWidth(); //padding
    });

    //Find out which ones to hide
    while (tabWidths > tabAreaWidth) {
        var hider = $(ShownTabs).last();
        tabWidths -= $(hider).outerWidth();
        $(hider).hide();
    }

    //See if we can show any
    firstHidden = $(HiddenTabs).first();
    while (firstHidden.length > 0 && (tabWidths + firstHidden.width()) < tabAreaWidth) {
        tabWidths += $(firstHidden).outerWidth();
        $(firstHidden).show();
        firstHidden = $(HiddenTabs).first();
    }

    //Affect drop-down button
    if ($(HiddenTabs).length === 0) {
        $('.report-pane-container #tabDrop').hide();
    } else {
        $('.report-pane-container #tabDrop').show();
    }

    //Hide drop-down tabs as necessary
    var shown = $(ShownTabs);
    $.each($('.report-pane-container #tabDropdown li'), function (idx, obj) {
        var isInShown = $.grep(shown, function (el) { return $(el).find('a').attr('href') == $(obj).find('a').data('target'); }).length > 0;
        if (isInShown) {
            $(obj).hide();
        } else {
            $(obj).show();
        }
    });
}

(function () {
    /**
     * Allows you to add data-method="METHOD to links to automatically inject a form
     * with the method on click
     *
     * Example: <a href="{{route('customers.destroy', $customer->id)}}"
     * data-method="delete" name="delete_item">Delete</a>
     *
     * Injects a form with that's fired on click of the link with a DELETE request.
     * Good because you don't have to dirty your HTML with delete forms everywhere.
     */
    function addDeleteForms() {
        $('[data-method]').append(function () {
            if (!$(this).find('form').length > 0) return "\n" + "<form action='" + $(this).attr('href') + "' method='POST' name='delete_item' style='display:none'>\n" + "   <input type='hidden' name='_method' value='" + $(this).attr('data-method') + "'>\n" + "   <input type='hidden' name='_token' value='" + $('meta[name="csrf-token"]').attr('content') + "'>\n" + "</form>\n";
            else return "";
        }).removeAttr('href').attr('style', 'cursor:pointer;').attr('onclick', 'delete_this_item(this)');
    }

    /**
     * Place any jQuery/helper plugins in here.
     */
    $(function () {
        /**
         * Add the data-method="delete" forms to all delete links
         */
        addDeleteForms();

        /**
         * This is for delete buttons that are loaded via AJAX in datatables, they will not work right
         * without this block of code
         */
        $(document).ajaxComplete(function () {
            addDeleteForms();
        });

        /**
         * Generic confirm form delete using Sweet Alert
         */
        $('body').on('submit', 'form[name=delete_item]', function (e) {
            e.preventDefault();
            var form = this;
            var link = $('a[data-method="delete"]');
            var cancel = link.attr('data-trans-button-cancel') ? link.attr('data-trans-button-cancel') : "Cancel";
            var confirm = link.attr('data-trans-button-confirm') ? link.attr('data-trans-button-confirm') : "Yes, delete";
            var title = link.attr('data-trans-title') ? link.attr('data-trans-title') : "Warning";
            var text = link.attr('data-trans-text') ? link.attr('data-trans-text') : "Are you sure you want to delete this item?";

            Swal.fire({
                title: title,
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: cancel,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: confirm,
            }).then((result) => {
                if (result.value) {
                    form.submit();
                }
            });
        });

        /**
         * Generic 'are you sure' confirm box
         */
        $('body').on('click', 'a[name=confirm_item]', function (e) {
            e.preventDefault();
            var link = $(this);
            var title = link.attr('data-trans-title') ? link.attr('data-trans-title') : "Are you sure you want to do this?";
            var cancel = link.attr('data-trans-button-cancel') ? link.attr('data-trans-button-cancel') : "Cancel";
            var confirm = link.attr('data-trans-button-confirm') ? link.attr('data-trans-button-confirm') : "Continue";

            Swal.fire({
                title: title,
                icon: "info",
                showCancelButton: true,
                cancelButtonText: cancel,
                confirmButtonColor: "#3C8DBC",
                confirmButtonText: confirm
            }).then((result) => {
                if (result.value) {
                    window.location = link.attr('href');
                }
            });
        });

        /**
         * Bind all bootstrap tooltips
         */
        // $("[data-toggle=\"tooltip\"]").tooltip();
        $('body').tooltip({
            selector: '[data-toggle=\"tooltip\"]'
        });

        $(document).on('mouseenter', '[rel=tooltip]', function () {
            $(this).tooltip('show');
        });

        $(document).on('mouseleave', '[rel=tooltip]', function () {
            $(this).tooltip('hide');
        });

        /**
         * Bind all bootstrap popovers
         */
        $("[data-toggle=\"popover\"]").popover();

        /**
         * This closes the popover when its clicked away from
         */
        $('body').on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        $(".btn-profile").click(function () {
            createModalAndLoadUrl('user-profile-management', window.please_wait_loader_html, window.base_url + '/account', function () { }, 'modal-lg');
        });

        var arrow_rgt = $('<i class="fa fa-step-forward" aria-hidden="true"></i>');
        var arrow_lft = $('<i class="fa fa-step-backward" aria-hidden="true"></i>');
        $(".btn-show-org-pane").click(function () {
            // is_org_pane_hidden = !is_org_pane_hidden;
            initZinoSplitter(window.is_org_pane_hidden);
            // switchShowOrgPaneArrows();

            $("#btn-refresh-tabs-data").trigger('click');
        });

        setTimeout(function () {
            if ($("#organization-pane").width() == 0) {
                is_org_pane_hidden = true;
                window.switchShowOrgPaneArrows();
                // $(".btn-show-org-pane").empty().append(arrow_rgt);
            }
        }, 3000);

        window.switchShowOrgPaneArrows = function () {
            var arrow = arrow_lft;
            if (is_org_pane_hidden) {
                arrow = arrow_rgt;
            }
            $(".btn-show-org-pane").empty().append(arrow);
        };
    });
})();

window.ajx = function (obj) {
    if ((typeof obj.type !== 'undefined' && obj.type.toLowerCase() == "post") || typeof obj.method !== 'undefined' && obj.method.toLowerCase() == "post") {
        if (typeof obj.data == "undefined") {
            obj.data = {};
        }

        if (typeof obj.data.append == "function") {
            obj.data.append('_token', window.Laravel.csrfToken);
        } else {
            obj.data._token = window.Laravel.csrfToken;
        }
    }
	var obj = $.ajax(obj);
	window.xhrNotificationsPool.push(obj);
    return obj;
};

function BulkOperation() {
    createModalAndLoadUrl('bulk_operations_modal', window.please_wait_loader_html, window.base_url + '/admin/bulk_filter/get_ui', function () {

    });
}

// var is_alarms_already_loaded = false;
function initZinoSplitter(show_org_pane = false) {
    if ($("body").width() < 1220) {
        return;
    }
    var windowHeight = $("body").height();
    var headerHeight = 51;
    var contentHeight = windowHeight - headerHeight; //Footer Removed

    $(".wrapper").zinoSplitter("destroy");
    $(".wrapper").zinoSplitter({
        orientation: "vertical",
        splitterSize: 0,
        panes: [
            { collapsible: false, resizable: false, size: headerHeight },
            { collapsible: false, resizable: false, size: contentHeight }
        ]
    });
    var reportWidth;
    var windowWidth = $("body").width() - 5;
    var isLaptop = windowWidth < 1350;
    var organizationWidth = isLaptop ? 16 : 19; // In %.
    var customerWidth = isLaptop ? 13 : 15; // In %.
    var criticalPaneWidth = isLaptop ? 19 : 21; // In %.

    var avlWidthOnePercent = windowWidth / 100;
    organizationWidth *= avlWidthOnePercent;
    customerWidth *= avlWidthOnePercent;
    criticalPaneWidth *= avlWidthOnePercent;
    var panes = [];
    var show_customers_pane = false;
    var showEmbededCriticalPane = false;

    if (window.active_organization_depth >= 4) {
        criticalPaneWidth = criticalPaneWidth;
        showEmbededCriticalPane = true;
    } else {
        criticalPaneWidth = 0;
    }
    if (window.is_customer_pane_permission) {
        if ((window.active_organization_depth >= 4) && window.active_hierarchy == 1) {
            show_customers_pane = true;
        }
        if (window.active_hierarchy != 1) {
            show_customers_pane = true;
        }
        if (show_customers_pane && window.active_organization != null && window.active_organization.original.count == 0) {
            show_customers_pane = false;
        }
    }

    $(".horizontal-inner-pane-wrapper").zinoSplitter("destroy");

    if (show_customers_pane) {
        if (!show_org_pane && window.active_hierarchy == 1) {
            organizationWidth = (window.is_hide_org_pane) ? 0 : organizationWidth;
        }
        if (organizationWidth == 0) {
            window.is_org_pane_hidden = true;
        } else {
            window.is_org_pane_hidden = false;
        }
        window.switchShowOrgPaneArrows();

        reportWidth = windowWidth - organizationWidth - customerWidth - criticalPaneWidth - 14;
		$(".cat_label_subdivision").css('display', 'block');
    } else {
        customerWidth = 0;
        reportWidth = windowWidth - organizationWidth - customerWidth - criticalPaneWidth - 14;
		$(".cat_label_subdivision").css('display', 'none');
    }
    panes = [
        { collapsible: false, resizable: false, size: organizationWidth, region: "west" },
        { collapsible: false, resizable: false, size: customerWidth, region: "west" },
        { collapsible: false, resizable: false, size: reportWidth, region: "east" },
        { collapsible: false, resizable: false, size: criticalPaneWidth, region: "east" }
    ];

    $(".horizontal-inner-pane-wrapper").zinoSplitter({
        panes: panes,
        expand: function (e, ui) {
            initZinoSplitter();
        },
        resize: function (e, ui) {
            e.stopPropagation();
            return false;
        },
    });

    var header_height = $('.header-carrier').height();
    var window_height = $(window).height();
    var zui_pane = $('body > div.wrapper.zui-splitter > div.content-wrapper.zui-splitter-pane.zui-splitter-pane-vertical');

    zui_pane.css('top', header_height + 'px');
    zui_pane.height(window_height - header_height);
    if (showEmbededCriticalPane) {
        $("div.non-embeded").hide();
        $("div.demo-panel.embeded").prev(".zui-splitter-separator").show();
        $("div.demo-panel.embeded").show();
        if (!is_show_customer_from_critical_pane && window.active_organization.data.depth < 5) {
            $('.demo-panel.embeded a[class^="btn-alrm-"]').first().trigger("click");
        }
    } else {
        $("div.non-embeded").removeClass('demo-panel-expanded');
        $("div.non-embeded").show().find('.demo-content').hide();
        $("div.demo-panel.embeded").prev(".zui-splitter-separator").hide();
        $("div.demo-panel.embeded").hide();
    }
    CheckTabSize();
    drawMeterPaneBreadcrumb();
}

function toggleCriticalAlarmPane(showhide) {
    if (showhide == "show") {
        $(".demo-panel").addClass("demo-panel-expanded").find('.content-panel').show();
    } else {
        $(".demo-panel").removeClass("demo-panel-expanded").find('.content-panel').hide();
    }
}

window.validateIfUnAuthenticated = function (response, callback, ...args) {
    if (typeof response === 'string' && response.indexOf('login-form-wrapper') > 0) {
        window.reloginRequired();
    } else {
        callback(response, ...args);
    }
};

window.reloginRequired = function () {
    swalAutoClose(trans('strings.Relogin Required'), trans('strings.Sorry, you are logged out. Redirecting to the login page.'), 'info', 5000);
    setTimeout(function () {
        window.location.reload(true);
    }, 5000);
};

var is_relogin_form_hidden = true;
(function ($) {
    $(function () {
        var is_loading_notifications = false;
        var is_search_node_clicked = false;
        var notificationsInterval = 0;

        /*
         *  Bind Bootstrap Tooltip.
         */
        $('body').tooltip({
            selector: '[data-toggle="tooltip"]'
        });

        /*
         * Show/Hide Loading on start/end of AJAX request
         */
		var ajax_loading_wrapper_class = ".ajax-loading-wrapper";
        var ajxLoadingWrapper = $(ajax_loading_wrapper_class);
        $(document).ajaxStart(function (ajax_request) {
            toggleAjaxLoading('show');
        });
        $(document).ajaxStop(function () {
            toggleAjaxLoading('hide');
        });
		$(document).on('click', ajax_loading_wrapper_class + ' .close', function() {
			$.each(window.xhrNotificationsPool, function (key, xhr) {
                xhr.abort();
            });
			toggleAjaxLoading('hide');
		});
        $.ajaxSetup({
            global: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            statusCode: {
                401: function () {
                    window.reloginRequired();
                },
            },
        });

        window.toggleAjaxLoading = function(type) {
			// console.log([type, window.do_ajax_loading, !is_tree_expanding, !is_loading_notifications]);
            if (type == "show") {
                if (window.do_ajax_loading && !is_tree_expanding && !is_loading_notifications) {//console.log('ali');
                    ajxLoadingWrapper.show();
                }
            } else {
                ajxLoadingWrapper.hide();
            }

            is_tree_expanding = false;
            is_loading_notifications = false;
        }

        // $('#relogin_modal .btn-relogin').on('click', function (e) {
        //     e.preventDefault();
        //     $.ajax({
        //         type: "POST",
        //         url: window.base_url + '/relogin',
        //         data: {
        //             code: $('#relogin_modal #code').val(),
        //             username: $('#relogin_modal #username').val(),
        //             password: $('#relogin_modal #password').val(),
        //             // _token: $('#relogin_modal input[name="_token"]').val(),
        //         },
        //         success: function (data) {
        //             if (data.success === true) {
        //                 $('#relogin_modal').modal('hide');
        //                 is_relogin_form_hidden = true;
        //                 location.reload(true);
        //                 $('#relogin_modal .alert').removeClass('alert-danger').addClass('alert-success').html("Successfully logged in. Reloading...").removeClass('hidden');
        //             } else {
        //                 $('#relogin_modal .alert').html(data.message).removeClass('hidden');
        //             }
        //         },
        //         error: function (data, xhr) {
        //             var errors = '';
        //             if (data.status == 422) {
        //
        //                 errors = '<ul>';
        //                 $.each(JSON.parse(data.responseText), function (key, val) {
        //                     errors += '<li>' + val[0] + '</li>';
        //                 });
        //                 errors += '</ul>';
        //             }
        //             if (data.success === false) {
        //                 errors = data.messsage;
        //             }
        //             $('#relogin_modal .alert').html(errors).removeClass('hidden');
        //         },
        //     });
        // });

        /*
         * Top Search with Autocomplete using jQuery UI Autocomplete Plugin.
         */
        var top_search_type = '';
        $input = $(".top-search-bar .search-key");
        $input1 = $(".top-search-bar .search-key1");
        var top_search_notice_box = $(".top-search-notice-box");
        var top_search_loader = $(".top-search-loader-icon");
        var min_length_message = top_search_notice_box.data('minlength-message');
        // var loading_message = top_search_notice_box.data('loading-message');
        window.selected_search_item = '';
        var typeahead_args = {
            //minLength: 4,
            source: function (key, callbck) {
                if (top_search_type == '') {
                    sweetAlert("Alert!", trans("Kindly select a search type"), "error");
                    return [];
                }

                if (key.term.length < 4) {
                    $(".ui-autocomplete").hide();
                    top_search_notice_box.html(min_length_message).removeClass('hidden');
                    return [];
                } else {
                    top_search_notice_box.addClass('hidden');
                }

                do_ajax_loading = false;
                top_search_loader.removeClass('hidden');
                ajx({
                    method: 'post',
                    url: window.base_url + '/admin/search/do_autocomplete',
                    data: {
                        'key': key.term,
                        type: top_search_type,
                    },
                    success: function (data) {
                        top_search_loader.addClass('hidden');
                        callbck(data);
                        do_ajax_loading = true;
                    },
                });
                do_ajax_loading = true;
            },
            position: { collision: "flip" },
            select: function (event, ui) {
                window.selected_search_item = ui.item;
                loadRespectiveSearchItem();
                responsive_search.hide();
            },

            // change: function(event, ui) {
            //     window.selected_search_item = ui.item;
            //     loadRespectiveSearchItem();
            //     responsive_search.hide();
            // },

            response: function (event, ui) {
                if (ui.content.length == 0) {
                    ui.content.push({ value: "", label: "No matches found." });
                }
            },
        };

        $.ui.autocomplete.prototype._renderMenu = function (ul, items) {
            var search_cat_count = 1;
            var self = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                if (typeof item.category != "undefined" && item.category != '' && item.category != currentCategory && top_search_type == 'Global') {
                    ul.append("<li class='ui-autocomplete-category autocomplete-category-" + item.category.toLowerCase().replace(' ', '-') + " cat" + search_cat_count + "'>&nbsp;" + item.category + "</li>");
                    currentCategory = item.category;
                    search_cat_count++;
                }
                self._renderItemData(ul, item);
            });
        };

        $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            var item_code = '';
            var item_name = '';
            if (item.category == 'Organizations') {
                item_name += '<span class="alabel">Name: ' + item.label + '</span> ';
            } else if (item.category == 'Groups') {
                item_name += '<span class="alabel">Name: ' + item.label + '</span> ';
            } else if (item.category == 'Public Sectors') {
                item_name += '<span class="alabel">Name: ' + item.label + '</span> ';
            } else if (item.category == 'Customer') {
                item_name += '<span class="alabel">Ref: ' + item.label + '</span> ';
            } else if (item.category == 'Meter' || item.category == 'Sim') {
                item_name += '<span class="alabel">MSN: ' + item.label + '</span> ';
            } else {
                item_name += '<span class="alabel">' + item.label + '</span> ';
            }

            if (typeof item.code != "undefined" && item.code != null && item.code != '') {
                item_code += `<span class="code">(Code: ${item.code})</span>
                              <span class="search-item-level-name">~${contextMenuLabel(item.depth)}</span>`;
            } else if (typeof item.customer_name != "undefined") {
                if (typeof item.wapda_customer_id != "undefined" && item.wapda_customer_id != null && item.wapda_customer_id != '') {
                    item_code += ' <span class="code">(Cust ID: ' + item.wapda_customer_id + ')</span>';
                }
                item_code += '<small class="customer_details">';
				if (item.category == 'Sim') {
					item_code += 'Sim #: ' + item.customer_name;
                } else if (item.customer_name != null && item.customer_name != '') {
                    item_code += 'Name: ' + item.customer_name;
                } else {
                    item_code += 'Name: N/A';
                }
                if (typeof item.cnic != "undefined" && item.cnic != null && item.cnic != '') {
                    item_code += ' (' + item.cnic + ')';
                }
                item_code += '</small>';
            } else if (typeof item.meter_type != "undefined") {
                if (item.meter_type != null && item.meter_type != '') {
                    item_code += ' <span class="code">(' + item.meter_type + ')</span>';
                }
                item_code += '<small class="customer_details">';
                if (typeof item.sim_num != "undefined" && item.sim_num != null && item.sim_num != '') {
                    item_code += 'Sim #: ' + item.sim_num;
                } else {
                    item_code += 'Sim #: N/A';
                }
                if (typeof item.ct_num != "undefined" && item.ct_num != null && item.ct_num != '') {
                    item_code += ' &nbsp;&nbsp;&nbsp;&nbsp;' + (item.ct_num / item.ct_denum) + "/" + (item.pt_num / item.pt_denum);
                }
                item_code += '</small>';
            }

            var item_ancestors = '';
            if (typeof item.ancestors != "undefined" && item.ancestors != "") {
                item_ancestors = '<small class="ancesstors"> Org 1: ' + item.ancestors + '</small>';
            }

            var item_ancestors2 = '';
            if (typeof item.ancestors2 != "undefined" && item.ancestors2 != '') {
                item_ancestors2 = '<small class="ancesstors" style="margin-top:0px;"> Org 2: ' + item.ancestors2 + '</small>';
            }

            var parent_menu = '';
            if (typeof item.p_menu_name != "undefined" && item.p_menu_name != null) {
                parent_menu = '<br><small class="p_menu_name">' + item.p_menu_name + '</small>';
            }

            return $('<li class="autocomplete-item"></li>')
                .data("item.autocomplete", item)
                .append('<a>' + item_name + item_code + item_ancestors + item_ancestors2 + parent_menu + '</a>')
                .appendTo(ul);
        };

        $input.autocomplete(typeahead_args).focus(function () {
			// $(this).val("");
            $(this).autocomplete("search");
        });
        $input1.autocomplete(typeahead_args).focus(function () {
			// $(this).val("");
            $(this).autocomplete("search");
        });

		$(window).on('focus', function() { $(".btn-goto-home").focus() });

        $(document).click(function () {
            top_search_notice_box.addClass('hidden');
        });

        $(".top-search-bar button.btn-search-by-type").click(function () {
            loadRespectiveSearchItem();
        });

        var responsive_search = $(".responsive-search");
        $(".top-search-bar button.btn-search1").click(function () {
            responsive_search.toggle();
        });

        $(document).mouseup(function (e) {
            // if the target of the click isn't the container nor a descendant of the container
            if (!responsive_search.is(e.target) && responsive_search.has(e.target).length === 0) {
                responsive_search.hide();
            }
        });

        $(window).resize(function () {
            responsive_search.hide();
        });

        var autocomplete_last_search = '';

        function loadRespectiveSearchItem() {
            var input = $input1;
            if ($(".search-key").is(":visible")) {
                input = $input;
            }
            if (typeof window.selected_search_item != "undefined" && window.selected_search_item != null && window.selected_search_item.value != '') {
                //if ( autocomplete_last_search == window.selected_search_item.value ) {
                switch (top_search_type) {
                    case 'Global':
                        switch (window.selected_search_item.category) {
                            case 'Organizations':
                            case 'Groups':
                            case 'Public Sectors':
                                doOrganizationSearch();
                                break;
                            case 'Customer':
                                doCustomerMeterSearch('Customer');
                                break;
                            case 'Meter':
                                doCustomerMeterSearch('Meter');
                                break;
                            case 'Menu':
                                doMenuSearch();
                                break;
                        }
                        break;
                    case 'Organization':
                    case 'Organizations':
                    case 'Groups':
                    case 'Public Sectors':
                        doOrganizationSearch();
                        break;
                    case 'Customer':
                    case 'Geolocation':
                        doCustomerMeterSearch(top_search_type);
                        break;
                    case 'Meter':
                    case 'Sim':
                        doCustomerMeterSearch(top_search_type);
                        break;
                    case 'Menu':
                        doMenuSearch();
                        break;
                }
                autocomplete_last_search = window.selected_search_item.value;
                //}
            }
        }

        function doOrganizationSearch() {
            if (window.selected_search_item.hierarchy != null && window.selected_search_item.hierarchy != '') {
                if ($('#select_1').val() != window.selected_search_item.hierarchy) {
                    $('#select_1').val(window.selected_search_item.hierarchy).trigger('change');
                }
            }
            loadOrgAncestors(window.selected_search_item.id, 'id');
        }

        function doMenuSearch() {
            try {
                eval(window.selected_search_item.function);
            }
            catch (err) {
                var reference_number = window.active_customer;
                eval(window.selected_search_item.function);
            }

        }

        $(window).resize(function () {
            initZinoSplitter();
        });

        initZinoSplitter();

        /***********************************************************************
         * Scroll handler for customers loading
         **********************************************************************/
        $(".customers-listing-container").scroll(function () {
            if (scrollTimer != -1) {
                clearTimeout(scrollTimer);
            }

            scrollTimer = window.setTimeout(function () {
                var that = $(".customers-listing-container");

                if (that[0].scrollTop + that.height() >= (that[0].scrollHeight - 200)) {
                    if (!reached_at_end) {
                        window.load_customers(last_shown_page + 1);
                    }
                }
                last_scroll_position = that[0].scrollTop;
            }, 500);
        });

		var hide_customer_pane_filter_dropdown = true;
        $('select[name="customers-order-by"]').on('change', function () {
			if ( hide_customer_pane_filter_dropdown ) {
				$("#meter-pane .dropdown-menu").hide();
			}
            resetCustomersListingFilter();
            customers_order_by = $(this).val();
            $(".filter-by-specific").html($(this).find('option:selected').text());
            $(".filter-by-specific-type").hide();
            filter_by_specific = '';
            filter_by_meter_type = '';
            $("#" + customers_order_by + '_wise').show();
            is_first_time = true;
            reached_at_end = false;
            loadFirstPageOfCustomers();
        });

        function loadFirstPageOfCustomers() {
            window.load_customers(1);
            if (communication_status_filter != 'all' || filter_by_specific != '' || communication_status_sort_by != 'reference_number') {
                showCustomerPaneLabel('filtered');
            } else {
                if (is_show_all_customers) {
                    showCustomerPaneLabel('all');
                }
            }
        }

        customers_order_by = $('select[name="customers-order-by"]').val();

        $(".btn-reset-filters").click(function () {
            customers_order_by = "transformer";

            $("select[name='customers-order-by']").val("transformer");
            $(".filter-by-specific-type").hide();
            $("#transformer_wise option:first").prop('selected', true);
            $("#filter_customer_by_status_all").prop("checked", true);
            $("#sort_customer_by_status option:first").prop("selected", true);

            communication_status_filter = 'all';
            filter_by_specific = '';
            filter_by_meter_type = '';
            communication_status_sort_by = 'reference_number';

            is_first_time = true;
            reached_at_end = false;
            loadFirstPageOfCustomers();
        });

        function resetCustomersListingFilter() {
            showCustomerPaneLabel('all');
            $(".filter-by-specific-type").hide();
            $("#filter_customer_by_status_all").prop("checked", true);

            communication_status_filter = 'all';
            filter_by_specific = '';
        }

        window.load_customers = function (pg_num, mode) {
            fetch_customers(pg_num, mode);
        }

        $("#filter_customer_by_status_all").prop('checked', true);

        window.fetch_customers = function (pg_num, mode) {
            ajx({
                'url': get_cst_ajx_url(),
                'method': 'get',
                'data': {
                    'cst_id':                       window.active_organization_id,
                    'pg_num':                       pg_num,
                    'customers_order_by':           customers_order_by,
                    'is_show_all_customers':        is_show_all_customers,
                    'communication_status_filter':  communication_status_filter,
                    'communication_status_sort_by': communication_status_sort_by,
                    'filter_by_specific':           filter_by_specific,
                    'filter_by_meter_type':         filter_by_meter_type,
                    'hierarchy':                    window.active_hierarchy,
                    'last_searched_customer':       last_searched_customer,
                    'last_searched_customer_type':  last_searched_customer_type,
					'device_type':                  window.active_device_type,
                },
                'success': function (data) {
                    is_customers_loaded = true;
                    if (data.no_permission_to_org == true) {
                        $('.customers-listing-container').html('<p>' + data.no_permission_to_org_message + '</p>');
                        $('.report-pane-container').html('<p>' + data.no_permission_to_org_message + '</p>');
                    } else {
                        customers_data = data['data'];
                        is_in_store = data['is_in_store'];
                        populate_customers_page(pg_num, mode);
                    }
                },
                'complete': function () {
                    is_org_selection_completed = true;
                },
            });

            if (filter_by_meter_type != '') {
                filter_by_meter_type = '';
            }
        };

        $("#meter-pane .btn-show-settings").click(function () {
			$("#meter-pane .dropdown-menu").toggle();
			if ($("#meter-pane .dropdown-menu").is(":visible")) {
				var elem = $("select[name='customers-order-by']");
				if ($("#" + elem.val() + "_wise").is(":hidden")) {
					hide_customer_pane_filter_dropdown = false;
					elem.trigger('change');
					hide_customer_pane_filter_dropdown = true;
				}
			}
        });

        $("#is_show_all_customers").change(function () {
            $("#meter-pane .dropdown-menu").hide();
            is_show_all_customers = this.checked;
            if (is_show_all_customers) {
                showCustomerPaneLabel('all');
            } else {
                $(".customer-pane-label").addClass('hidden');
            }
            window.reload_current_node();
        });

        $(document).on('change', '.filter_customer_by_status', function (event) {
            $("#meter-pane .dropdown-menu").hide();
            var target = $(event.target);
            if (target.is(":checked")) {
                communication_status_filter = target.val();
            }
            window.reload_current_node();
        });
        communication_status_filter = $(".filter_customer_by_status:checked").val();

        $(document).on('change', '.sort_customer_by_status', function (event) {
            resetCustomersListingFilter();
            $("#meter-pane .dropdown-menu").hide();
            // var target = $(event.target);
            // if (target.is(":selected")) {
            communication_status_sort_by = $(this).val();
            // }
            window.reload_current_node();
        });
        communication_status_sort_by = $(".sort_customer_by_status").val();

        $(".btn-filter-by-specific").on('click', function () {
            resetCustomersListingFilter();
            $("#meter-pane .dropdown-menu").hide();
            var val = $("#" + customers_order_by + '_wise').val();
            if (val == '') {
                sweetAlert("Alert!", trans("strings.Kindly provide a filter."), "error");
                return;
            }
            filter_by_specific = val;
            window.reload_current_node();
        });

        $('select.filter-by-specific-type').on('change', function () {
            let val = $(this).val();
            if (val == '' || !val) {
                sweetAlert("Alert!", trans("strings.Kindly provide a filter."), "error");
                return;
            }
			$("#meter-pane .dropdown-menu").hide();
            filter_by_specific = val;
            is_first_time = true;
            reached_at_end = false;
            loadFirstPageOfCustomers();
        });
        $('input.filter-by-specific-type').on('keyup', function (e) {
			if(e.which == 13) {
				let val = $(this).val();
				if (val == '' || !val) {
					sweetAlert("Alert!", trans("strings.Kindly provide a filter."), "error");
					return;
				}
				$("#meter-pane .dropdown-menu").hide();
				filter_by_specific = val;
				is_first_time = true;
				reached_at_end = false;
				loadFirstPageOfCustomers();
		    }
        });
        window.reload_current_node = function () {
            js_tree_elem.jstree("deselect_all");
            js_tree_elem.jstree(true).select_node(window.active_organization_id);
            $(document).trigger('click');
        };

        $(".hierarchy-switch-wrapper span").append($("#organization-pane").find("#select_1").clone(true));
        $("#organization-pane .col-md-12").find("#select_1").hide();

        var is_page_loaded_now = true;
        $('#tree_1').on("select_node.jstree", function (e, data) {

            var parents = data.node.parents;
            org_ancestors_for_breadcrumb = {};
            for (var i = parents.length - 2; i > -1; i--) {
                var node = data.instance.get_node(parents[i]).original;
                org_ancestors_for_breadcrumb[node.id] = node.name;
            }
            org_ancestors_for_breadcrumb[data.node.original.id] = data.node.original.name;
            drawMeterPaneBreadcrumb();
			// console.log(window.xhrNotificationsPool);
            // Abort all notification request.
            $.each(window.xhrNotificationsPool, function (key, xhr) {
                xhr.abort();
            });
			window.xhrNotificationsPool = [];

            if ($(".btn-reset-filters").is(":visible") && is_load_org_tabs) {
                resetCustomersListingFilter();
            }

            // ajxLoadingWrapper.show();
            is_loading_notifications = false;
            clearInterval(notificationsInterval);
            if (window.critical_pane_auto_hide != 1) {
                toggleCriticalAlarmPane('hide');
            }

            // keep last onn_id for undo
            var last_onn_id = window.active_organization_id == 0 ? data.node.id : window.active_organization_id;
            // window.keepAction('onn_id', last_onn_id);

            window.active_organization = data.node;
            window.active_organization_id = data.node.id;
            window.active_organization_depth = data.node.data.depth;
            if (window.top_organization_id == 0) {
                window.top_organization_id = data.node.id;
            }

			// $(".btn-onn-sync-ibs").attr('data-onn', window.active_organization_id);

            is_first_time = true;
            reached_at_end = false;
            last_shown_page = 0;

            toggleCustomerExportOptions();

            $(window).trigger('resize');

            if (do_load_customers) {
                is_customers_loaded = false;
                is_tariff_tab_loaded = false;
                is_communications_tab_loaded = false;

                if ($("#meter-pane").width() != 0) {
                    load_customers(1);
                }
                window.active_org_id = window.active_organization_id;
                if (is_load_org_tabs && last_searched_customer == '') {
                    create_org_tabs();
                }
                if (!is_page_loaded_now) {
                    //refreshActiveTab();
                } else {
                    is_page_loaded_now = false;
                }

                if (communication_status_filter != 'all' || filter_by_specific != '' || communication_status_sort_by != 'none') {
                    showCustomerPaneLabel('filtered');
                } else {
                    if (is_show_all_customers) {
                        showCustomerPaneLabel('all');
                    }
                }

                // Load notifications when customers list and tariff details tab got loaded.
                // notificationsInterval = setInterval(function () {
                // if (is_customers_loaded && is_tariff_tab_loaded) {
                // if ( is_customers_loaded ) {
                // clearInterval(notificationsInterval);
				if (data.node.data.depth < 5) {
	                is_loading_notifications = true;
	                // ajxLoadingWrapper.hide();
	                load_notifications();
				}
                // }
                // }, 1000);
            } else {
                do_load_customers = true;
				if (data.node.data.depth < 5) {
	                is_loading_notifications = true;
	                // ajxLoadingWrapper.hide();
	                load_notifications();
				}
                is_search_node_clicked = true;
            }

			if (data.node.data.depth >= 4) {
				$(".report-pane-header .btn-onn-sync-container").show();
			} else {
				$(".report-pane-header .btn-onn-sync-container").hide();
			}

            if (is_load_org_tabs && last_searched_customer == '') {
                let obj = $("a.jstree-clicked");
                triggerTabClick(obj);
            }
            getSmallOrgInfo(data.node.original);
            $('#tree_1').jstree().close_node({ "id": data.node.id });
            is_load_org_tabs = true;

			// check if need to load the transformers
			if (data.node.data.depth > 3 && customers_order_by == 'transformer') {
                loadTransformerDropdown();
			}
            if (data.node.data.depth < 4) {
                $(".demo-panel .content-panel").addClass("hidden");
            } else {
                $(".demo-panel .content-panel").removeClass("hidden");
			}
			is_show_customer_from_critical_pane = false;

			// $(".btn-onn-sync-container").show();
            if (window.active_organization_depth == 1) {
                updateCustomersInWarehouse();
            }
        });

        var is_update_warehouse = true;
        function updateCustomersInWarehouse() {
            if ( is_update_warehouse ) {
                var active_hierarchy = window.active_hierarchy;
                ajx({
                    'type': 'get',
                    'url': window.base_url + '/admin/organizations/update_customers_in_warehouse',
                    'data': { onn_id: window.active_org_id },
                }).done(function (data) {
                    if (data.success) {
                        $('#tree_' + active_hierarchy).jstree("load_node", window.active_org_id);
                        is_update_warehouse = false;
                    }
                });
            } else {
                is_update_warehouse = true;
            }
        }

        //
        // let obj = $("a.jstree-clicked");
        // triggerTabClick( obj );

        $('.search-panel .dropdown-menu').find('a').click(function (e) {
            e.preventDefault();
            top_search_type = $(this).data('search_type');
            $('.search-panel span#search_concept').text(top_search_type);
            $('.input-group #search_param').val($(this).attr("href").replace("#", ""));
        });

        $('.search-panel .dropdown-menu a:eq(0)').trigger('click');

        // On customer click show tabs and customer & meter info.
        window.active_cst_rfr_num = '';
        window.active_cst_id = '';
        window.active_org_id = '';

        $(document).on('click', 'li.cst', function () {
            window.active_cst_rfr_num = $(this).data('encoded_reference_number');
            create_cst_tabs();
            $('.report-pane-container li.active').removeClass('active');

            // keep last ctr_id for undo.
            var last_active_cst_id = window.active_cst_id == "" ? $(this).data('encoded_id') : window.active_cst_id;
            // window.keepAction('ctr_id', last_active_cst_id);

            window.active_cst_id = $(this).data('encoded_id');
            window.active_customer_id = window.active_cst_id;

            var tab = null;
            if (!window.pinned_customer_tab || window.pinned_customer_tab == '') {
                tab = $('.report-pane-container .nav-tabs > li > a:eq(0)');
                tab.tab('show');
            } else {
                tab = $('.report-pane-container .nav-tabs > li > a[href="' + window.pinned_customer_tab + '"]:eq(0)');
                tab.closest('li').find('.customer-tabs-pin-btn').addClass('active');
                tab.tab('show');
            }

			$(".btn-onn-sync-container").hide();
        });

        $(".customer-report-export-optons > a").click(function () {
            eval($(this).data('key'));
        });

        function create_cst_tabs(active_tab) {
            // ajxLoadingWrapper.show();
            // is_loading_notifications = false;
            $(".report-pane-container").empty();
            $(".report-pane-container").html($(".tabs-for-customer-details").html());
            toggleCustomerExportOptions(true);
            // $(".customer-report-export-optons").show('fast');
            // $('#show_charts_on_dashboard_switch').show('fast');
            $('.report-pane-container .nav-tabs a').on('shown.bs.tab', function (event) {
                if (window.active_cst_rfr_num == '') {
                    return;
                }
                $('.report-pane-container .tab-pane.active').html('<br><b>Loading...</b>');
                customer_details_active_tab = event.target;

                eval($(this).data('key'));
            });

            CheckTabSize();
        }

        function toggleCustomerExportOptions(show) {
            drawMeterPaneBreadcrumb();
            if (show) {
                $(".customer-report-export-optons").show('fast');
                $('#show_charts_on_dashboard_switch').show('fast');
            } else {
                $(".customer-report-export-optons").hide('fast');
                $('#show_charts_on_dashboard_switch').hide('fast');
            }
        }

        function create_org_tabs(active_tab) {
            $(".report-pane-container").empty();
            $(".report-pane-container").html($(".tabs-for-organization-details").html());
            //$(".customer-report-export-optons").show();

            $('.report-pane-container .nav-tabs a').on('shown.bs.tab', function (event) {
                if (window.active_org_id == '') return;
                org_details_active_tab = event.target;
                eval($(this).data('key'));
            });
        }

        function getCustomerInfo() {
            ajx({
                'url': window.base_url + '/' + 'admin/get_customer_details',
                'method': 'get',
                'data': { cst: window.active_cst_id },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #info").html(data);
                    });
                },
            });
        }

        function bindDatePicker(elem) {
            $(elem).bootstrapDP({
                format: 'dd-M-yyyy',
                autoclose: true,
                todayBtn: 'linked',
                todayHighlight: true,
            }).on('hide', function(e) {
		        $(this).parents('table').find('.btn-filter-cst-data').trigger('click');
		    });
			$(elem).parent().find('.input-group-addon').click(function() {
				$(elem).focus();
			});
            // $(elem).datetimepicker({
            //     format: 'DD-MMM-Y',
            //     defaultDate: Date.now(),
            // });
        }

        // number_of_rows_to_load = Math.floor(($("#report-pane").height() - 300) / 34);
        number_of_rows_to_load = 50;

        // Subdivision Summary
        function getSubdivisionSummary() {
            $(".report-pane-container .tab-content #general-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_subdivision_summary',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    onn_depth: window.active_organization_depth,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    is_communications_tab_loaded = true;
                    $(".report-pane-container .tab-content #general-summary").html(data);
                },
            });
        }

        // Org Stats (Tariff Details).
        function getOrgStats() {
            $(".report-pane-container .tab-content #communication-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_communication_statistics',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    onn_depth: window.active_organization_depth,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    is_communications_tab_loaded = true;
                    $(".report-pane-container .tab-content #communication-summary").html(data);
                },
            });
        }
        // Org Tariff Summary.
        function getTariffSummary() {
            $(".report-pane-container .tab-content #tariff-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_tariff_summary',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        is_tariff_tab_loaded = true;
                        $(".report-pane-container .tab-content #tariff-summary").html(data);
                    });
                },
            });
        }
        // Org Mute Summary
        function getMuteSummary() {
            $(".report-pane-container .tab-content #mute-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_mute_summary',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    onn_depth: window.active_organization_depth,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    is_communications_tab_loaded = true;
                    $(".report-pane-container .tab-content #mute-summary").html(data);
                },
            });
        }
        // Org Live Load Summary.
        function getLiveLoadSummary() {
            $(".report-pane-container .tab-content #live-load-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_live_load_summary',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        is_tariff_tab_loaded = true;
                        $(".report-pane-container .tab-content #live-load-summary").html(data);
                    });
                },
            });
        }

        // Org Billing Statistics.
        function getBillingStatistics() {
            var dt = $('#billing-statistics #start_date').val();
            $(".report-pane-container .tab-content #billing-statistics").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_billing_statistics',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                    dt: dt
                },
                'success': function (data) {
                    $(".report-pane-container .tab-content #billing-statistics").html(data);

                },
            });
        }

        // Org Jobs Summary.
        function getJobsSummary() {
            $(".report-pane-container .tab-content #jobs-summary").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_jobs_summary',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #jobs-summary").html(data);
                    });
                },
            });
        }

        // Org info.
        function getOrgInfo() {
            $(".report-pane-container .tab-content #info").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_org_info',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #info").html(data);
                    });
                },
            });
        }

        // Energy Auditing.
        window.getOrgEnergyAuditing = function () {
            var dt = $('#energy-auditing #start_date').val();
            $(".report-pane-container .tab-content #energy-auditing").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_org_energy_auditing',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    dt: dt,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #energy-auditing").html(data);
                    });
                },
            });
        }

        window.getOperationalStatus = function () {
            var dt = $('#workflow-status #start_date').val();
            $(".report-pane-container .tab-content #workflow-status").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_org_operational_statuses',
                'method': 'get',
                'data': {
                    onn: window.active_organization_id,
                    device_type: window.active_device_type,
                    filters: window.dashboard_filters_data,
                    mtps: window.usr_mtps,
                    dt: dt,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #workflow-status").html(data);
                    });
                },
            });
        };

        window.getOrganizationGIS = function () {
            var ajax_data = {
                onn: window.active_organization_id,
                device_type: window.active_device_type,
                filters: window.dashboard_filters_data,
                mtps: window.usr_mtps,
                'location': $(".report-pane-container #geographical-information-gis #location_radio").prop('checked'),
                'telco': $(".report-pane-container #geographical-information-gis #telco_radio").prop('checked'),
                'electricity_availability': $(".report-pane-container #geographical-information-gis #electricity_availability_radio").prop('checked')
            };

            $(".report-pane-container .tab-content #geographical-information-gis").html("<br><b>Loading...</b>");
            ajx({
                'url': window.base_url + '/' + 'admin/get_org_gis',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #geographical-information-gis").html(data);
                    });
                },
            });
        };

        $(document).on('click', '.report-pane-container #geographical-information-gis [name="optradio"]', function () {
            getOrganizationGIS();
        });

        function bindDateRangeSelector( start_date_el_id, end_date_el_id ) {
            // Date Range
            var date_format = 'd-M-yyyy';
            $(start_date_el_id).bootstrapDP({
                format: date_format,
                autoclose: true,
                todayBtn: 'linked',
                todayHighlight: true,
            }).on("changeDate", function (e) {
                $(end_date_el_id).bootstrapDP('show');
            });

            $(end_date_el_id).bootstrapDP({
                format: date_format,
                autoclose: true,
                todayBtn: 'linked',
                todayHighlight: true,
            });
        }

        // Daily Read.
        function getDailyRead() {
			var _mf = $('input[name=daily-read-mf]').length > 0 ? $('input[name=daily-read-mf]').is(':checked') : true;
			var _ibs_mf = $('input[name=daily-read-mf-ibs]').length > 0 ? $('input[name=daily-read-mf-ibs]').is(':checked') : false;
            if(_mf){
                $('input[name=daily-read-mf-ibs]').attr('checked', false);
            }
            if(_ibs_mf){
                $('input[name=daily-read-mf]').attr('checked', false);
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_daily_reads',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    mf_ibs: _ibs_mf,
                    date_from: $(".report-pane-container #daily-read #daily-read-date-from").val(),
                    date_to: $(".report-pane-container #daily-read #daily-read-date-to").val(),
                    pg: $(".report-pane-container .daily-read #daily-read-pg").val(),
                    chart_type: $(".report-pane-container #daily-read #chart_type_daily_read").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content #daily-read").html(data);
                        // bindDatePicker(".report-pane-container .tab-content #daily-read .datepicker");
                        bindDateRangeSelector(".report-pane-container .tab-content #daily-read .datepicker-start", ".report-pane-container .tab-content #daily-read .datepicker-end");
                        $(".report-pane-container .daily-read .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .daily-read #daily-read-pg").val(pg);
                            getDailyRead();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container #daily-read #daily-read-mf", function () {
            getDailyRead();
        });
        $(document).on('change', ".report-pane-container #daily-read #daily-read-mf-ibs", function () {
            getDailyRead();
        });
        $(document).on('click', ".report-pane-container #daily-read .btn-filter-cst-data", function () {
            getDailyRead();
        });

        // Monthly Billing
        function getMonthlyBilling() {
			var _mf = $('input[name=monthly-billing-mf]').length > 0 ? $('input[name=monthly-billing-mf]').is(':checked') : true;
			var _mf_ibs = $('input[name=monthly-billing-mf-ibs]').length > 0 ? $('input[name=monthly-billing-mf-ibs]').is(':checked') : false;
            if(_mf) {
                $('input[name=monthly-billing-mf-ibs]').attr('checked', false);
            }
            if(_mf_ibs){
                $('input[name=monthly-billing-mf]').attr('checked', false);
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_monthly_billing',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    mf_ibs: _mf_ibs,
                    date_from: $(".report-pane-container .monthly-billing #monthly-billing-date-from").val(),
                    date_to: $(".report-pane-container .monthly-billing #monthly-billing-date-to").val(),
                    pg: $(".report-pane-container .monthly-billing #monthly-billing-pg").val(),
                    chart_type: $(".report-pane-container .monthly-billing #chart_type_monthly_billing").val(),
                    cnt: 12,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .monthly-billing").html(data);
                        // bindDatePicker(".report-pane-container .tab-content #monthly-billing .datepicker");
                        bindDateRangeSelector(".report-pane-container .monthly-billing .datepicker-start", ".report-pane-container .monthly-billing .datepicker-end");
                        $(".report-pane-container .monthly-billing .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .monthly-billing #monthly-billing-pg").val(pg);
                            getMonthlyBilling();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .monthly-billing #monthly-billing-mf", function () {
            getMonthlyBilling();
        });
        $(document).on('change', ".report-pane-container .monthly-billing #monthly-billing-mf-ibs", function () {
            getMonthlyBilling();
        });
        $(document).on('click', ".report-pane-container .monthly-billing .btn-filter-cst-data", function () {
            getMonthlyBilling();
        });

        $(document).on('click', ".btn-show-advance-monthly-billing-data", function () {
            createModalAndLoadUrl('showAdvanceMonthlyBillingData', window.please_wait_loader_html, window.base_url + '/admin/show_advance_monthly_billing_data?cst=' + window.active_cst_rfr_num + '&cst_encoded_id=' + window.active_cst_id + '&is_first_time=1', function () { }, 'modal-xl');
        });

        $(document).on('click', ".btn-see-data-on-mdc", function () {
            var type = $(this).data('type');
            createModalAndLoadUrl('btn-see-data-on-mdc', window.please_wait_loader_html, window.base_url + '/admin/see_data_on_mdc?cst_encoded_id=' + window.active_cst_id + '&type=' + type, function () { }, 'modal-xl');
        });

        $(document).on('click', ".btn-show-advance-daily-read-data", function () {
            createModalAndLoadUrl('showAdvanceDailyReadData', window.please_wait_loader_html, window.base_url + '/admin/show_advance_daily_ready_data?cst=' + window.active_cst_rfr_num + '&cst_encoded_id=' + window.active_cst_id + '&is_first_time=1', function () { }, 'modal-xl');
        });

        $(document).on('click', ".btn-show-advance-instant-read-data", function () {
            createModalAndLoadUrl('showAdvanceInstantReadData', window.please_wait_loader_html, window.base_url + '/admin/show_advance_instant_ready_data?cst=' + window.active_cst_rfr_num + '&cst_encoded_id=' + window.active_cst_id + '&is_first_time=1', function () { }, 'modal-xl');
        });

        // Events tab.
        function getEvents() {
            ajx({
                'url': window.base_url + '/' + 'admin/get_events_tab',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    date_from: $(".report-pane-container .eventsalarms #eventsalarms-date-from").val(),
                    date_to: $(".report-pane-container .eventsalarms #eventsalarms-date-to").val(),
                    events_filter: $(".report-pane-container .eventsalarms #eventsalarms-name-filter").val(),
                    pg: $(".report-pane-container .eventsalarms #eventsalarms-pg").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .eventsalarms").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .eventsalarms .datepicker");
                        bindDateRangeSelector(".report-pane-container .eventsalarms .datepicker-start", ".report-pane-container .eventsalarms .datepicker-end");
                        $(".report-pane-container .eventsalarms .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .eventsalarms #eventsalarms-pg").val(pg);
                            getEvents();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .eventsalarms #eventsalarms-mf", function () {
            getEvents();
        });
        $(document).on('click', ".report-pane-container .eventsalarms .btn-filter-cst-data", function () {
            getEvents();
        });

        // Events All tab.
        function getAllEventsTab() {
            ajx({
                'url': window.base_url + '/' + 'admin/get_all_events_tab',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    date_from: $(".report-pane-container .all-eventsalarms #all-eventsalarms-date-from").val(),
                    date_to: $(".report-pane-container .all-eventsalarms #all-eventsalarms-date-to").val(),
                    events_filter: $(".report-pane-container .all-eventsalarms #eventsalarms-name-filter").val(),
                    pg: $(".report-pane-container .all-eventsalarms #eventsalarms-pg").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .all-eventsalarms").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .all-eventsalarms .datepicker");
                        bindDateRangeSelector(".report-pane-container .all-eventsalarms .datepicker-start", ".report-pane-container .all-eventsalarms .datepicker-end");
                        $(".report-pane-container .all-eventsalarms .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .all-eventsalarms #eventsalarms-pg").val(pg);
                            getAllEventsTab();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .all-eventsalarms #eventsalarms-mf", function () {
            getAllEventsTab();
        });
        $(document).on('click', ".report-pane-container .all-eventsalarms .btn-filter-cst-data", function () {
            getAllEventsTab();
        });

        // Critical Alarms Tab.
        function getCriticalAlarmsTab() {
            var _mf = true;
            var mf_field = $(".report-pane-container .critical-alarms #critical-alarms-mf");
            if (mf_field.length > 0) {
                _mf = mf_field.is(":checked");
            }
            ajx({
                'url': window.base_url + '/' + 'admin/get_critical_alarms_tab',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    date_from: $(".report-pane-container .critical-alarms #critical-alarms-date-from").val(),
                    date_to: $(".report-pane-container .critical-alarms #critical-alarms-date-to").val(),
                    events_filter: $(".report-pane-container .critical-alarms #critical-alarms-name-filter").val(),
                    pg: $(".report-pane-container .critical-alarms #critical-alarms-pg").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .critical-alarms").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .critical-alarms .datepicker");
                        bindDateRangeSelector(".report-pane-container .critical-alarms .datepicker-start", ".report-pane-container .critical-alarms .datepicker-end");
                        $(".report-pane-container .critical-alarms .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .critical-alarms #critical-alarms-pg").val(pg);
                            getCriticalAlarmsTab();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .critical-alarms #critical-alarms-mf", function () {
            getCriticalAlarmsTab();
        });
        $(document).on('click', ".report-pane-container .critical-alarms .btn-filter-cst-data", function () {
            getCriticalAlarmsTab();
        });

        function getAllCriticalAlarmsTab() {
            var _mf = true;
            var mf_field = $(".report-pane-container .all-critical-alarms #critical-alarms-mf");
            if (mf_field.length > 0) {
                _mf = mf_field.is(":checked");
            }
            ajx({
                'url': window.base_url + '/' + 'admin/get_all_critical_alarms_tab',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    date_from: $(".report-pane-container .all-critical-alarms #all-critical-alarms-date-from").val(),
                    date_to: $(".report-pane-container .all-critical-alarms #all-critical-alarms-date-to").val(),
                    events_filter: $(".report-pane-container .all-critical-alarms #critical-alarms-name-filter").val(),
                    pg: $(".report-pane-container .all-critical-alarms #critical-alarms-pg").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .all-critical-alarms").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .all-critical-alarms .datepicker");
                        bindDateRangeSelector(".report-pane-container .all-critical-alarms .datepicker-start", ".report-pane-container .all-critical-alarms .datepicker-end");
                        $(".report-pane-container .all-critical-alarms .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .all-critical-alarms #critical-alarms-pg").val(pg);
                            getAllCriticalAlarmsTab();
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .all-critical-alarms #critical-alarms-mf", function () {
            getAllCriticalAlarmsTab();
        });
        $(document).on('click', ".report-pane-container .all-critical-alarms .btn-filter-cst-data", function () {
            getAllCriticalAlarmsTab();
        });

        //communication log
        function getCommunicationLog(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .comm-log #comm-log-date-from").val(),
                date_to: $(".report-pane-container .comm-log #comm-log-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_communication_log',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .comm-log").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .comm-log .datepicker");
                        bindDateRangeSelector(".report-pane-container .comm-log .datepicker-start", ".report-pane-container .comm-log .datepicker-end");
                        $(".report-pane-container .comm-log .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getCommunicationLog(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .comm-log .btn-filter-cst-data", function () {
            getCommunicationLog();
        });

        //complaints log
        function getComplaintsTab(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .complaints #complaints-date-from").val(),
                date_to: $(".report-pane-container .complaints #complaints-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_complaints_tab',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .complaints").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .complaints .datepicker");
                        bindDateRangeSelector(".report-pane-container .complaints .datepicker-start", ".report-pane-container .complaints .datepicker-end");
                        $(".report-pane-container .complaints .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getComplaintsTab(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .complaints .btn-filter-cst-data", function () {
            getComplaintsTab();
        });

        //complaints log
        function getLoadSheddingTab(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .load-shedding #loadshedding-date-from").val(),
                date_to: $(".report-pane-container .load-shedding #loadshedding-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_loadshedding_tab',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .load-shedding").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .load-shedding .datepicker");
                        bindDateRangeSelector(".report-pane-container .load-shedding .datepicker-start", ".report-pane-container .load-shedding .datepicker-end");
                        $(".report-pane-container .load-shedding .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getLoadSheddingTab(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .load-shedding .btn-filter-cst-data", function () {
            getLoadSheddingTab();
        });

        //on demand jobs
        function getOnDemandJobs(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .on-demand-jobs #on-demand-jobs-date-from").val(),
                date_to: $(".report-pane-container .on-demand-jobs #on-demand-jobs-date-to").val(),

                show_active_jobs: $('.report-pane-container .on-demand-jobs #show_active_jobs').prop('checked'),
                show_completed_jobs: $('.report-pane-container .on-demand-jobs #show_completed_jobs').prop('checked'),
                show_cancelled_jobs: $('.report-pane-container .on-demand-jobs #show_cancelled_jobs').prop('checked'),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_on_demand_jobs',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .on-demand-jobs").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .on-demand-jobs .datepicker");
                        bindDateRangeSelector(".report-pane-container .on-demand-jobs .datepicker-start", ".report-pane-container .on-demand-jobs .datepicker-end");
                        $(".report-pane-container .on-demand-jobs .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getOnDemandJobs(pg);
                            return false;
                        });

                        $(".report-pane-container .on-demand-jobs .radio input").change(function (e) {
                            getOnDemandJobs();
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .on-demand-jobs .btn-filter-cst-data", function () {
            getOnDemandJobs();
        });

        // device communication history
        function getDeviceCommunicationHisotry(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .comm-history #on-demand-jobs-date-from").val(),
                date_to: $(".report-pane-container .comm-history #on-demand-jobs-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_device_communication_history',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .comm-history").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .comm-history .datepicker");
                        bindDateRangeSelector(".report-pane-container .comm-history .datepicker-start", ".report-pane-container .comm-history .datepicker-end");
                        $(".report-pane-container .comm-history .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getDeviceCommunicationHisotry(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .comm-history .btn-filter-cst-data", function () {
            getDeviceCommunicationHisotry();
        });

        // Mute Meter history
        function getMuteMeterHisotry(page = null) {

            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .mute-history #mute-history-date-from").val(),
                date_to: $(".report-pane-container .mute-history #mute-history-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_mute_meter_history',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .mute-history").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .mute-history .datepicker");
                        bindDateRangeSelector(".report-pane-container .mute-history .datepicker-start", ".report-pane-container .mute-history .datepicker-end");
                        $(".report-pane-container .mute-meter-history .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getMuteMeterHisotry(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .mute-history .btn-filter-cst-data", function () {
            getMuteMeterHisotry();
        });


        //Data Schedules
        function getDataSchedules(page = null) {

            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .data-schedules #data-schedules-date-from").val(),
                date_to: $(".report-pane-container .data-schedules #data-schedules-date-to").val(),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_data_schedules',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .data-schedules").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .data-schedules .datepicker");
                        bindDateRangeSelector(".report-pane-container .data-schedules .datepicker-start", ".report-pane-container .data-schedules .datepicker-end");
                        $(".report-pane-container .data-schedules .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getDataSchedules(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('click', ".report-pane-container .data-schedules .btn-filter-cst-data", function () {
            getDataSchedules();
        });

        // Instant Read.
        window.getInstantRead = function(page = null) {
			var _mf = $('input[name=instant-read-mf]').length > 0 ? $('input[name=instant-read-mf]').is(':checked') : true;
			var _ibs_mf = $('input[name=instant-read-mf-ibs]').length > 0 ? $('input[name=instant-read-mf-ibs]').is(':checked') : false;
            if(_mf){
                $('input[name=instant-read-mf-ibs]').attr('checked', false);
            }
            if(_ibs_mf){
                $('input[name=instant-read-mf]').attr('checked', false);
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_instant_data',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    mf_ibs: _ibs_mf,
                    date_from: $(".report-pane-container .instant-read #instant-read-date-from").val(),
                    date_to: $(".report-pane-container .instant-read #instant-read-date-to").val(),
                    pg: $(".report-pane-container .instant-read #instant-read-pg").val(),
                    chart_type: window.instant_read_graph_last_state,
                    cnt: number_of_rows_to_load,
                    'page': page,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .instant-read").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .instant-read .datepicker");
                        bindDateRangeSelector(".report-pane-container .instant-read .datepicker-start", ".report-pane-container .instant-read .datepicker-end");
                        $(".report-pane-container .instant-read .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .instant-read #instant-read-pg").val(pg);
                            getInstantRead(pg);
                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .instant-read #instant-read-mf", function () {
            getInstantRead();
        });
        $(document).on('change', ".report-pane-container .instant-read #instant-read-mf-ibs", function () {
            getInstantRead();
        });
        $(document).on('click', ".report-pane-container .instant-read .btn-filter-cst-data", function () {
            getInstantRead();
        });

        // Load Profile.
        function getLoadProfile() {
			var _mf = $('input[name=load-profile-mf]').length > 0 ? $('input[name=load-profile-mf]').is(':checked') : true;
			var _ibs_mf = $('input[name=load-profile-mf-ibs]').length > 0 ? $('input[name=load-profile-mf-ibs]').is(':checked') : false;
            if(_mf){
                $('input[name=load-profile-mf-ibs]').attr('checked', false);
            }
            if(_ibs_mf){
                $('input[name=load-profile-mf]').attr('checked', false);
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_load_profile',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    mf: _mf,
                    mf_ibs: _ibs_mf,
                    date_from: $(".report-pane-container .load-profile #load-profile-date-from").val(),
                    date_to: $(".report-pane-container .load-profile #load-profile-date-to").val(),
                    pg: $(".report-pane-container .load-profile #load-profile-pg").val(),
                    chart_type: $(".report-pane-container .load-profile #load_profile_chart").val(),
                    cnt: number_of_rows_to_load,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .load-profile").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .load-profile .datepicker");
                        bindDateRangeSelector(".report-pane-container .load-profile .datepicker-start", ".report-pane-container .load-profile .datepicker-end");
                        $(".report-pane-container .load-profile .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            $(".report-pane-container .load-profile #load-profile-pg").val(pg);
                            getLoadProfile();
                            return false;
                        });
                    });
                },
            });
        }

		$(document).on('change', ".report-pane-container .load-profile #load-profile-mf", function () {
            getLoadProfile();
        });
        $(document).on('change', ".report-pane-container .load-profile #load-profile-mf-ibs", function () {
            getLoadProfile();
        });
        $(document).on('click', ".report-pane-container .load-profile .btn-filter-cst-data", function () {
            getLoadProfile();
        });

        // Activity Log Summary.
        function getActivityLogSummary() {
            ajx({
                'url': window.base_url + '/' + 'admin/get_activity_log_summary',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .activity-log").html(data);
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .activity-log", function () {
            getActivityLogSummary();
        });
        $(document).on('click', ".report-pane-container .activity-log .btn-filter-cst-data", function () {
            getActivityLogSummary();
        });

        // Activity Log.
        function getActivityLog(pg) {
            pg = (typeof pg == "undefined" ? 1 : pg);
            ajx({
                'url': window.base_url + '/' + 'admin/get_activity_log',
                'method': 'get',
                'data': {
                    cst: window.active_cst_rfr_num,
                    cst_encoded_id: window.active_cst_id,
                    page: pg,
                },
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .activity-log").html(data);
                        $(".report-pane-container .tab-content .activity-log .pagination a").click(function (e) {
                            e.stopPropagation();
                            pg = $(this).attr('href').split('=')[1];
                            getActivityLog(pg);

                            return false;
                        });
                    });
                },
            });
        }
        $(document).on('change', ".report-pane-container .activity-log", function () {
            getActivityLog();
        });
        $(document).on('click', ".report-pane-container .activity-log .btn-filter-cst-data", function () {
            getActivityLog();
        });

        // Monthly Billing History.
        function getMonthlyBillingLocked(page = null) {
            var ajax_data = {
                cst: window.active_cst_rfr_num,
                cst_encoded_id: window.active_cst_id,
                date_from: $(".report-pane-container .monthly-billing-locked #on-demand-jobs-date-from").val(),
                date_to: $(".report-pane-container .monthly-billing-locked #on-demand-jobs-date-to").val(),

                show_active_jobs: $('.report-pane-container .monthly-billing-locked #show_active_jobs').prop('checked'),
                show_completed_jobs: $('.report-pane-container .monthly-billing-locked #show_completed_jobs').prop('checked'),
                show_cancelled_jobs: $('.report-pane-container .monthly-billing-locked #show_cancelled_jobs').prop('checked'),
            };

            if (page) {
                ajax_data.page = page;
            }

            ajx({
                'url': window.base_url + '/' + 'admin/get_monthly_billing_history',
                'method': 'get',
                'data': ajax_data,
                'success': function (data) {
                    validateIfUnAuthenticated(data, function () {
                        $(".report-pane-container .tab-content .monthly-billing-locked").html(data);
                        // bindDatePicker(".report-pane-container .tab-content .monthly-billing-locked .datepicker");
                        bindDateRangeSelector(".report-pane-container .monthly-billing-locked .datepicker-start", ".report-pane-container .monthly-billing-locked .datepicker-end");
                        $(".report-pane-container .monthly-billing-locked .pagination a").click(function (e) {
                            e.stopPropagation();
                            var pg = $(this).attr('href').split('=')[1];
                            getMonthlyBillingLocked(pg);

                            return false;
                        });

                        $(".report-pane-container .monthly-billing-locked .radio input").change(function (e) {
                            getMonthlyBillingLocked();
                        });
                    });

                },
            });
        }
        $(document).on('click', ".report-pane-container .monthly-billing-locked .btn-filter-cst-data", function () {
            getMonthlyBillingLocked();
        });

        $(document).on('click', ".btn-fetch-latest-data", function () {
            var that = this;
            getPinAndCallFunction(function (pin) {
                ajx({
                    type: 'post',
                    data: {
                        cst_encoded_id: window.active_cst_id,
                        req_type: $(that).data("req-type"),
                        '_pin': pin,
                    },
                    url: window.base_url + '/' + 'admin/fetch-latest-data',
                }).done(function (data) {
                    validateIfUnAuthenticated(data, function () {
                        if (data.success != 'undefined' && data.success == false) {
                            Swal.fire('', data.msg, 'error');
                            return;
                        }

                        if (data.errors && data.errors.length > 0) {
                            showErrors(data.errors);
                        } else {
                            Swal.fire('', data.msg, 'success');
                        }
                    });
                }).fail(function (jqXHR, exception) {
                    ajax_errors_sweetalert_func(jqXHR, exception);
                });
            });
        });

		window.fetch_latest_data2 = function() {
			var that = $(".customer-tabs-container .tab-pane.in .btn-fetch-latest-data");
			ajx({
				type: 'post',
				data: {
					cst_encoded_id: window.active_cst_id,
					req_type: $(that).data("req-type"),
					is_fetch_latest: 1
				},
				url: window.base_url + '/' + 'admin/fetch-latest-data2',
			}).done(function (data) {
			}).fail(function (jqXHR, exception) {
			});
		};

        // Mega menu.
        $('.top-header-nav li.dropdown').hover(function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).slideDown();
        }, function () {
            //$(this).find('.dropdown-menu').stop(true, true).delay(500).slideUp(1000);
            $(this).find('.dropdown-menu').stop(true, true).delay(100).slideUp(50);
        });

        // Right sidebar critical alarms.
        $('.demo-panel a[class^="btn-alrm-"]').click(function () {
            $(".switch-panel .demo-switch").removeClass('active');
            $(".demo-panel .content-panel").removeClass('hidden');
            // keep last active tab for undo action.
            var last_active_critical_alarm_tab = window.active_critical_alarm_tab == null ? this : window.active_critical_alarm_tab;
            // window.keepAction('alarms_tab', last_active_critical_alarm_tab);

            window.active_critical_alarm_tab = this;
            $(this).addClass('active');
            var parentClass;
            if ($(this).parents(".demo-panel").hasClass('non-embeded')) {
                parentClass = ".non-embeded";
            } else if ($(this).parents(".demo-panel").hasClass('embeded')) {
                parentClass = ".embeded";
            }

            $(".demo-panel" + parentClass + " #critical-export-btns-container").empty();
            // if (!is_undo_action) {
                toggleCriticalAlarmPane('show');
            // }
			var label = $(this).data("content-heading");
			var label_elem = $(".demo-panel" + parentClass + " .box-header .box-title");
            label_elem.html(label).addClass("h-md");
			if ( (label.includes('Critical') || label.includes('Mute') ) ) {
				label_elem.addClass('text-danger');
			} else {
				label_elem.removeClass('text-danger');
			}

            var that = $(this);
            var id = that.data('id');

            //var is_tab_loaded = that.data("is-tab-loaded");   //commented out to refresh right panel every time when user clicks on button
            var is_tab_loaded = 0; //commented out to refresh right panel every time when user clicks on button

            $(".demo-panel" + parentClass + " .box-body > div").addClass('hidden');
            $(".demo-panel" + parentClass + " .box-body-" + id).html('<p class="panel-loading text-center">Loading...</p>').removeClass('hidden');;

            if (is_tab_loaded == 0) {
                ajx({
                    'url': window.base_url + '/' + $(this).data('key'),
                    'method': 'get',
                    'data': {
                        'onn': window.active_organization_id,
                    },
                    'success': function (data) {
                        validateIfUnAuthenticated(data, function () {
                            var data = arguments[0];
                            var that = arguments[1];
                            var parentClass = arguments[2];
                            var id = arguments[3];
                            that.data("is-tab-loaded", 1);
                            if (data.success == true) {
                                $(".demo-panel" + parentClass + " .box-body-" + id).html(data.data);
                                $(".demo-panel" + parentClass + " #critical-export-btns-container").html($(".demo-panel" + parentClass + " .critical-export-btns"));
                            } else {
                                $(".demo-panel" + parentClass + " .box-body-" + id).html('<span class="text-bold">No data found</span>').removeClass('hidden');
                            }
                        }, that, parentClass, id);
                    },
                });
            } else {
                $(".demo-panel" + parentClass + " .box-body-" + id).removeClass('hidden');
            }
            $("div.demo-panel.embeded").removeClass('demo-panel-expanded');
        });

        // if ( window.critical_pane_show_embedded || is_show_embeded_critical_pane_on_division) {
        //  $('.demo-panel a[class^="btn-alrm-"]').first().trigger("click");
        // }

        $(document).mouseup(function (e) {
            var container = $(".demo-panel");
            // if the target of the click isn't the container nor a descendant of the container.
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if (window.critical_pane_auto_hide == 1 && $('.demo-panel.non-embeded').is(':visible')) {
                    toggleCriticalAlarmPane('hide');
                }
            }
        });

        $('.demo-panel .btn-close-alarms-panel').click(function () {
            toggleCriticalAlarmPane('hide');
        });
    });
})(jQuery);

function aboutPopup() {
    createModalAndLoadUrl('about-modal', window.please_wait_loader_html, 'about', function () { }, 'modal-md');
}

function getChangeLogAjaxObject(data) {
    return ajx({
        type: 'get',
        url: window.base_url + '/admin/show-changelog',
        data: data,
    });
}

function showChangeLog() {
    createModalAndLoadAjaxResponse('changelog', window.please_wait_loader_html, getChangeLogAjaxObject(), null, 'modal-md');
}

function showChangeLog1(value) {
    request = getChangeLogAjaxObject({ 'ver_chng_lg_id': value });
    request.done(function (data) {
        let modal = $("div#changelog");
        modal.find('.modal-body').empty();
        modal.find('.modal-body').html('<div>Please wait...</div>');
        modal.find('.modal-body *').fadeOut('slow', function () {
            if (data.success != undefined && data.success == false) {
                modal.find('.modal-body').html(`<div class="alert alert-danger">` + data.message + `</div>`);
            } else {
                modal.find('.modal-body').html(data).fadeIn('slow');
            }
        });
    });

    // loadAjaxResponseInModal(, window.please_wait_loader_html, , null, 'modal-md');
}

function load_notifications() {
	if ( is_show_customer_from_critical_pane ) {
		return;
    }
    setTimeout(function () {
        var notification_types = [];
        if (notification_types.length < 1) {
            $(".demo-panel .box-body > div").each(function (i) {
                var id = $(this).data('id');
                if (id != "user-management-log" && !notification_types.includes(id)) {
                    notification_types.push(id);
                }
            });
        }

        // $.each(["critical-alarms-log", "mute-meters", "grey-meters", "system-health", "complaints"], function (key, value) {
        //     $(".btn-alrm-" + value + " .notifications-count").html('...').show();
        // });

        var parent_demo_panel_container = $(".demo-panel:visible");
        $(".notifications-count", parent_demo_panel_container).hide();

        var connection_type = "";
        var elm_connection_type = $('input[name="connection_type"]:checked');

        if (typeof elm_connection_type != "undefined") {
            connection_type = elm_connection_type.val();
        }

        xhrNotificationsPool.push(ajx({
            'url': window.base_url + '/' + 'admin/get_alarms_with_stats',
            'method': 'get',
            'data': {
                onn: window.active_organization_id,
                not_tps: notification_types,
                device_type: window.active_device_type,
                mtps : window.usr_mtps,
                connection_type: connection_type,
            },
            'success': function (data) {
                if (data.success == true) {
                    $.each(data.counts, function (key, value) {
                        if (key == "system-health" || key == "show-only-public-events") return;

                        if (value > 0) {
                            if ($(".btn-alrm-" + key + " .notifications-count", parent_demo_panel_container).length > 0) {
                                $(".btn-alrm-" + key + " .notifications-count", parent_demo_panel_container).html(value).show();
                            } else {
                                $(".btn-alrm-" + key, parent_demo_panel_container).parent().find(".notifications-count").html(value).show();
                            }
                        }
                    });
					if ( parent_demo_panel_container && $(".demo-switch.active").length > 1 ) {
						$(".demo-switch.active").trigger("click");
					}
                }
            }
        }));
    }, 100);
}

function refreshActiveHierarchyTree() {
    var active_hierarchy = window.active_hierarchy;

    ajx({
        'type': 'get',
        'url': window.base_url + '/admin/organizations/fix_tree',
    }).done(function (data) {
        if (data.success == true) {
            $('#tree_' + active_hierarchy).jstree('refresh');
        }
    });
}

function editComplain(complain_id, callback) {
    createModalAndLoadUrl('edit_complain', window.please_wait_loader_html, window.base_url + '/admin/alarms/edit_complain/' + complain_id, function () {
        callback();
    }, 'modal-xl');
}

function doCustomerMeterSearch(search_type) {
    last_searched_customer = window.selected_search_item.id;
    last_searched_customer_type = search_type;

    loadOrgAncestors(window.selected_search_item.grand_parent_id, 'id');

    return;
}

function showCustomerPaneLabel(type) {
    // $(".customer-pane-label").addClass("hidden");
    // if (type == 'filtered') {
        customers_order_by = customers_order_by.replace('_', ' ');
        $('.is-showing-only-filtered-customer-label').removeClass("hidden").find('.filter-type').html(customers_order_by.charAt(0).toUpperCase() + customers_order_by.slice(1));
    // }
}

function selectTreeNode(tree_element, decrypted_node_id) {
    loadOrgAncestors(decrypted_node_id, 'id', true, tree_element);
}

function loadOrgAncestors(key, typ, do_click, tree_element) {
    tree_element = (typeof tree_element !== 'undefined') ? tree_element : js_tree_elem;
    do_click = (typeof do_click !== 'undefined') ? do_click : true;
    is_org_selection_completed = false;

    ajx({
        'method': 'post',
        'url': window.base_url + "/admin/organizations_get_ancestors",
        'data': {
            str: key,
            type: typ,
        },
        'success': function (data) {
            if (data.length == 0) {
                return;
            }

            var node_to_be_selected = data[data.length - 1].id;
            var selected_node = '';
            var selection_interval_counter = 0;

            $(".loading-wrapper").show();
            expandTree(0, data, tree_element);//console.log(data);console.log(tree_element);
            var selection_interval = setInterval(function () {
                $(".loading-wrapper").show();
                elm_meter_pane_breadcrumb.empty();
                do_load_customers = do_click;
                tree_element.jstree("deselect_all");
                tree_element.jstree(true).select_node(node_to_be_selected);
                selected_node = tree_element.jstree('get_selected')[0];
                selection_interval_counter++;
                if (node_to_be_selected == selected_node || selection_interval_counter > 100) {
                    tree_element.jstree(true).open_node(node_to_be_selected);
                    var node_selector = "#" + $.escapeSelector(selected_node);
                    if (node_selector != '#') {
                        tree_element.scrollTop(0);
                        if (typeof $(node_selector).position() != "undefined") {
                            tree_element.scrollTop($(node_selector).position().top - tree_element.outerHeight() / 2);
                        }
                    }

                    $(".loading-wrapper").hide();
                    clearInterval(selection_interval);
                    is_org_selection_completed = true;
                }
            }, 200);
            $(".loading-wrapper").hide();
        },
    });
}

function expandTree(i, nodes, tree_element) {
    tree_element = (typeof tree_element !== 'undefined') ? tree_element : js_tree_elem;
    if (i < nodes.length) {
        tree_element.jstree("open_node", nodes[i].id, function () {
            expandTree(++i, nodes);
        });
    }
    return false;
}

var elm_report_pane_breadcrumb_container = null;
var elm_meter_pane_breadcrumb = null;
var org_ancestors_for_breadcrumb = {};
function drawMeterPaneBreadcrumb() {
    if (elm_report_pane_breadcrumb_container == null) {
        elm_report_pane_breadcrumb_container = $("#report-pane .breadcrumb-container");
    }
    if (elm_meter_pane_breadcrumb == null) {
        elm_meter_pane_breadcrumb = $("#report-pane .breadcrumb");
    }
    var length = Object.keys(org_ancestors_for_breadcrumb).length;
    var width = elm_report_pane_breadcrumb_container.width();
    var max_width = width / length;
    var breadcrumb_li_max_width = Math.round(100 / length);
    elm_meter_pane_breadcrumb.empty();
    var count = length;
    $.each(org_ancestors_for_breadcrumb, function (key, name) {
        if (name != '') {
            var new_max_width = max_width - ((max_width / 100) * (5 * count));

            elm_meter_pane_breadcrumb.append('<li style="max-width: ' + new_max_width + ';"><a href="#" data-id="' + key + '"><span>' + name + '</span></a></li>');
            count--;
        }
    });
}

$(document).on("click", "#report-pane .breadcrumb li a", function () {
    js_tree_elem.find('li[id="' + $(this).data('id') + '"] a').click();
});

function showCustomerByReferenceNumber(id, grand_parent_onn_id) {
	is_show_customer_from_critical_pane = true;
    window.selected_search_item = { id: id, grand_parent_id: grand_parent_onn_id };
    doCustomerMeterSearch("Customer");
}
function showCustomerByReferenceNumber2(id, grand_parent_onn_id) {
	is_transformer_searched = true;
	showCustomerByReferenceNumber(id, grand_parent_onn_id);
	// is_show_customer_from_critical_pane = true;
    // window.selected_search_item = { value: ref_num };
    // doCustomerMeterSearch("Customer");
}
// load Transformer Dropdown
function loadTransformerDropdown() {
    $.ajax({
        type: "get",
        url: window.base_url + "/admin/organizaion-transformers",
        data: { 'org_id': window.active_organization.id },
        success: function (transformers) {
            let options = '<option value="all">All</option>';
            transformers.forEach((transformer) => {
                options += `<option value="` + transformer.id + `">` + transformer.name + `</option>`;
            });
            $('select#transformer_wise').html(options);
        }
    });
}
var last_subdivision = '';
var last_feeder = '';
function populate_customers_page(pg_num, mode) {
    if (customers_data != '' && typeof customers_data != "undefined") {
        var cst_str = '';
        if (pg_num === 1) {
			last_subdivision = '';
            last_feeder = '';
        }

		var subdivision_str = '';
		$.each( customers_data, function( key, cst_obj ) {
			// grouping of customers
			if (cst_obj.data.length > 0 && customers_order_by != '' && window.active_hierarchy == 1) {
				var group_icon = '';
				if (customers_order_by == 'transformer') {
					group_icon = '<span class="grp_sts ' + (cst_obj.transformer_status !== '' ? ( cst_obj.transformer_status === 1 ? 'on' : 'off' ) : '') + ' apms_sts_' + cst_obj.transformer_sts + '"></span>';
				}
				if (last_subdivision == '') {
					var raw_width = parseFloat(( $(".customers-listing-container").width() + "" ).replace( /[^\d\.]*/g, ''));
					subdivision_str = '<div class="cat_label_subdivision" data-onn-id="' + cst_obj.subdivision_id + '" title="' + cst_obj.subdivision_name + '" style="position: absolute; width: ' + ( raw_width - 18 ) + 'px; z-index: 1;">' +
						'<div><span class="grp_sts"></span><span class="group_name" style="width: ' + ( raw_width - 50 ) + 'px; display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">' + cst_obj.subdivision_name + ' (' + cst_obj.subdivision_count + ') - (Subdivision)</span></div></div>';
					last_subdivision = cst_obj.subdivision_name;
				}
				if (last_feeder != cst_obj.feeder_name) {
					cst_str += '<li class="cat_label_feeder" data-onn-id="' + cst_obj.feeder_id + '" data-toggle="tooltip" data-placement="top" data-html="true" title="' + cst_obj.feeder_name + '">' +
						'<div><span class="grp_sts"></span><span class="group_name">' + cst_obj.feeder_name + ' (' + cst_obj.feeder_count + ')</span></div></li>';
					last_feeder = cst_obj.feeder_name;
				}

				cst_str += '<li data-customer="" class="cat_label_transformer" data-onn-id="' + cst_obj.transformer_id + '" data-toggle="tooltip" data-placement="top" data-html="true" title="' + cst_obj.transformer_name + '" data-apms-reference-number="' + cst_obj.encoded_apms_reference_number + '" data-cst_reference_number="' + cst_obj.apms_reference_number + '">' +
					'<div>' + group_icon + cst_obj.cat_name + '</div>\
				</li>';
			}

			// customers rendering
			for (var cj = 0; cj < cst_obj.data.length; cj++) { // nested customer loop
				var cst = cst_obj.data[cj];
				str_msn = "";
				if (cst.mer_id != null) {
					var com_pro_id = cst.com_pro_id == null || cst.com_pro_id == 0 ? 0 : 1;
					if (window.show_msn == 1) {
						str_msn = '<div class="cst_msn">\
							<span class="tree-left-icon"></span>\
							<span class="ref-wrapper mer_sts comm_pro_' + com_pro_id + ' comm_mode_' + cst.comm_mode + '">' + cst.msn + '</span>\
						</div>';
					} else {
						str_msn = "";
					}
				}
				var last_comm_time = '';
				if (cst.sts_name != 'Not Communicated') {
                    if (cst.communication_status == 12) {
                        last_comm_time = '<br>' + cst.last_communication_time + '<br> COA: ' + cst.last_op_status_time + '<br>' + cst.attribute_title;                    
                    } else if (cst.communication_status == 8) {
                        last_comm_time = '<br>' + cst.last_communication_time + '<br>MCO: ' + cst.mco_date;                    
                    } else if (cst.communication_status == 9) {
                        last_comm_time = '<br>' + cst.last_communication_time + '<br>RCO: ' + cst.rco_date;                    
                    } else if (cst.communication_status == 10) {
                        last_comm_time = '<br>' + cst.last_communication_time + '<br>TDCO: ' + cst.tdco_date;                    
                    } else if (cst.communication_status == 11) {
                        last_comm_time = '<br>' + cst.last_communication_time + '<br>PDCO: ' + cst.pdco_date;                    
                    } else {
                        last_comm_time = '<br>' + cst.last_communication_time;                    
                    }                    
                }                

				let is_show = (cst.is_check_connection == 1) ? 'hidden' : '';
                let is_in_store_class = (is_in_store ? 'cst_in_store' : '')
                cst_str += '<li id="' + cst_obj.transformer_id + '_' + cst.is_check_connection + '" class="cst ' + is_in_store_class + ' ' + is_show + '" data-encoded_id="' + cst.encoded_id + '" data-encoded_reference_number="' + cst.encoded_reference_number + '" data-cst_reference_number="' + cst.rf + '" data-is_check_connection="' + cst.is_check_connection + '" data-toggle="tooltip" data-placement="top" data-html="true" title="' + cst.sts_name + last_comm_time + '">\
					<div class="cst_rf">\
						<span class="cst_sts cst_sts_' + cst.sts + ' cst_comm_sts_' + cst.communication_status + ' tms_' + cst.is_check_connection + '"></span>\
						<span class="ref-wrapper">' + cst.rf + '</span>\
					</div>\
					' + str_msn + '\
				</li>';
			}
		});

        if ((customers_data.length < 1 && is_first_time) || cst_str == '') {
            if (!reached_at_end) {
                if (last_shown_page > 0) {
                    $('.pg_' + pg_num + '').remove();
                    $(".customers-listing-container").append('<div class="pg_' + pg_num + '"> <br><p class="text-bold">No more customers found.</p></div>');
                    reached_at_end = true;
                } else {
                    $('.customers-listing-container p.text-bold').remove();
                    $(".customers-listing-container").html('<p class="text-bold">No customers found.</p>');
                }
            }
            return;
        }

        cst_str = '<div class="pg_' + pg_num + '"> ' + subdivision_str + '<ul style="padding-top: ' + ( pg_num == 1 ? 30 : 0 ) + 'px;">' + cst_str + '</ul></div>';
        if (is_first_time) {
            $(".customers-listing-container").empty();
            is_first_time = false;
        }

        last_shown_page = pg_num;
        $(".customers-listing-container").append(cst_str);
        $(".customers-listing-container").css("overflow-y", "auto");

    } else {
        if (last_shown_page > 0) {
            $(".customers-listing-container").append('<div class="pg_' + pg_num + '"> <p class="text-bold">No more customers found.</p></div>');
            $(".customers-listing-container").html('<p class="text-bold">No customers found.</p>');
        }
    }

    if (last_searched_customer != '') {
		if ( is_transformer_searched || ( window.selected_search_item != "" && window.selected_search_item.is_check_connection == 1 ) ) {
			$('li.cat_label_transformer[data-apms-reference-number="' + $('.customers-listing-container li.cst:first').data('encoded_reference_number') + '"]').trigger('click').trigger('mousedown');
			is_transformer_searched = false;
		} else {
			$('.customers-listing-container li.cst:first').trigger('click').trigger('mousedown');
		}
        last_searched_customer = '';
        last_searched_customer_type = '';
    }

    return customers_data.length;
}

function getMbReadingByDate(date, msn, callBackFunc) {
    ajx({
        url: window.base_url + "/admin/get_mb_reading_by_date",
        type: 'get',
        data: { 'date': date, 'msn': msn }
    }).done(function (data) {
        callBackFunc(data)
    }).fail(function () {

    });
}

function getDailyReadingByDate(date, msn, callBackFunc) {
    ajx({
        url: window.base_url + "/admin/get_daily_reading_by_date",
        type: 'get',
        data: { 'date': date, 'msn': msn }
    }).done(function (data) {
        callBackFunc(data)
    }).fail(function () {

    });
}

// $('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
//     $('a[data-toggle="tab"]').tab("dispose");
//     $(event.relatedTarget).parent().removeClass('active');
// });

$(document).on('click', '.report-pane-container #tabDrop', function () {
    $('.org-tabs.nav-tabs li').removeClass('active');
    var activeTab = $('.report-pane-container .tab-pane.active');
    if (activeTab.length > 0) {
        var activeID = $(activeTab[0]).attr('id');
        $('.report-pane-container .nav-tabs li a[data-target="#' + activeID + '"]').parent().addClass('active');
    }
});

$(document).on('shown.bs.tab', '.customer-info-tabs a[data-toggle="tab"]', function (e) {
    var last_active_ctr_tab = window.active_ctr_tab == null ? $(e.target).attr('href') : window.active_ctr_tab;
    // window.keepAction('ctr_tab', last_active_ctr_tab);
    window.active_ctr_tab = $(e.target).attr('href');
});

$(document).on('shown.bs.tab', '.org-tabs a[data-toggle="tab"]', function (e) {
    var last_active_org_tab = window.active_org_tab == null ? $(e.target).attr('href') : window.active_org_tab;
    // window.keepAction('onn_tab', last_active_org_tab);
    
    window.active_org_tab = $(e.target).attr('href');
});

function triggerTabClick(obj) {
	// let level = obj.parent().attr("aria-level");
	// let tab = ( level == 1 ? 1 : 0);
	// $('.nav-tabs > li > a:eq(' + tab + ')').tab('show');
	$('.nav-tabs > li > a:eq(0)').tab('show');
	CheckTabSize();
	return;

    // let level = obj.parent().attr("aria-level");
    // var response = window.org_assigned_tabs[level - 1];
    // reloadTabs();
    // if ($.trim(response) != "false") {
    //     response = ($.trim(response) != "" && $.trim(response) != " ") ? $.trim(response) : 1;
    //     let tab = $("a[data-tab-id='" + response + "']:first");
    //     if (tab.length != 0) {
    //         tab.tab('show');
    //         tab.parent().addClass('active');
    //     } else {
    //         showOrgTabToLevel(level);
    //     }
    // } else {
    //     showOrgTabToLevel(level);
    // }
}

// function reloadTabs() {
//     var $link = $('li.active a[data-toggle="tab"]:eq(0)');
//     $link.parent().removeClass('active');
// }
//
// function showOrgTabToLevel(level) {
//     switch (level) {
//         case "1":
//             $('.nav-tabs > li > a:eq(0)').tab('show');
//             break;
//         case "2":
//         case "3":
//         case "4":
//             $('.nav-tabs > li > a:eq(1)').tab('show');
//             break;
//         default:
//             $('.nav-tabs > li > a:eq(3)').tab('show');
//             break;
//     }
// }

function trans_choice(key, count = 1, replace = {}) {

    return key.replace("strings.", "");
    // let translation = key.split('.').reduce((t, i) => t[i] || null, window.translations).split('|');

    // translation = count > 1 ? translation[1] : translation[0];

    // for (var placeholder in replace) {
    //     translation = translation.replace(`:${placeholder}`, replace[placeholder]);
    // }

    // return translation;
}

function trans(key, replace = {}) {

    return key.replace("strings.", "");
    // let translation = key.split('.').reduce((t, i) => t[i] || null, window.translations);

    // for (var placeholder in replace) {
    //     translation = translation.replace(`:${placeholder}`, replace[placeholder]);
    // }

    // return translation;
}

window.contextMenuLabel = function(depth, next = false) {
    var Orgs = ["Disco Hierarchy", "Disco", "Circle", "Division", "Sub-Division", "Feeder", "Transformer"];

	if ( next && Orgs[depth + 1] != undefined ) {
		return Orgs[depth + 1];
	} else if ( ! next && Orgs[depth] != undefined ) {
		return Orgs[depth];
	} else {
		return 'Organization';
	}
}

function checkActiveHierarchy() {
    if ($(".modal.fade.in").length > 0) {
        return true;
    } else {
        return (window.active_hierarchy == 1) ? true : false;
    }
}

function changeCustomerCommunicationStatus(new_status_id) {
    var elm = $('#meter-pane .customers-listing-container li[data-encoded_id="' + window.active_customer_id + '"] span.cst_sts');
    $.each(window.customer_communication_statuses, function (key, val) {
        elm.removeClass('cst_comm_sts_' + val);
    })
    elm.addClass('cst_comm_sts_' + new_status_id);

    if (new_status_id == 7 || new_status_id == 11) {
        $.each(window.customer_statuses, function (key, val) {
            elm.removeClass('cst_sts_' + val);
        });
        elm.addClass('cst_sts_1');
    }

    elm.parents('li').trigger('click');
}

// trigger the critical pane option when relevenat chart option is clicked

function triggerCriticalPaneOption(option) {

    if (option == 'DCOs') {
        $('.demo-panel a.btn-alrm-disconnected-customers:visible').trigger('click');
    } else if (option == 'Critical Alarms') {
        $('.demo-panel a.btn-alrm-critical-alarms-events:visible').trigger('click');
    } else if (option == 'Disconnected Transformers') {
        $('.demo-panel a.btn-alrm-disconnected-transformers:visible').trigger('click');
    } else if (option == 'Grey') {
        $('.demo-panel a.btn-alrm-gray-meters-alerts:visible').trigger('click');
    } else if (option == 'Mute') {
        $('.demo-panel a.btn-alrm-mute-meters-alerts:visible').trigger('click');
    } else if (option == 'Inactive') {
        $('.demo-panel a.btn-alrm-waiting-for-activation-meters:visible').trigger('click');
	}

    return;
}

function updateCustomerCountAndEnableCustomerPane(updateCount = false, organization = window.active_organization_id) {

    if (updateCount) {
        updateOrgCount(organization);
        is_first_time = true;
        window.load_customers(1);
        updateCustomerCountRequest();
    } else {
		loadJstreeData();
	}
}

function updateOrgCount(organization) {

    organization = getNodeObject(organization);
    let parentOrganizations = organization.parents;
    parentOrganizations.unshift(organization.id);
    $.each(parentOrganizations, function (key, valInner) {
        let elm = $('a[id="' + valInner + '_anchor' + '"]');
        let content = elm.html();
        if (typeof content != "undefined") {
            new_content = content.replace(/\((\d+)+\)/g, function (match, number) {
                return "(" + (parseInt(number) + 1) + ")";
            });
            elm.html(new_content);
        }
    });
}

function updateCustomerCountRequest(time = 3000) {
    setTimeout(function () {
        window.do_ajax_loading = false;
        ajx({
            'type': 'get',
            'url': window.base_url + '/admin/organizations/refresh_customers_count',
            success: function (response) {
                loadJstreeData();
            }
        });
        window.do_ajax_loading = true;
    }, time);

}

// JS TREE FUNCTIONS
function getNodeObject(node = window.active_organization.id, tree = '#tree_1') {
    return $(tree).jstree().get_node(node);
}
function getNodeDetails(node = window.active_organization.id, tree = '#tree_1') {
    return $(tree).jstree().get_node(node).original;
}
