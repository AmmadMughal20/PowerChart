
function onDemandDailyRead(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-daily-read',
        data: { 'reference_number': reference_number },
    })
    createModalAndLoadAjaxResponse('onDemandDailyRead', window.please_wait_loader_html, ajax_object, null, 'modal-md');

    $('.customer-info-tabs li.tab a[href="#daily-read"]').tab('show');
}

function onDemandInstantRead(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-instant-read',
        data: { 'reference_number': reference_number },
    })
    createModalAndLoadAjaxResponse('onDemandInstantRead', window.please_wait_loader_html, ajax_object, null, 'modal-md');

    $('.customer-info-tabs li.tab a[href="#instant-read"]').tab('show');
}

function onDemandMonthlyBilling(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-monthly-billing',
        data: { 'reference_number': reference_number },
    })
    createModalAndLoadAjaxResponse('onDemandMonthlyBilling', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    $('.customer-info-tabs li.tab a[href="#monthly-billing"]').tab('show');
}

function onDemandLoadProfile(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-load-profile',
        data: { 'reference_number': reference_number },
    })
    createModalAndLoadAjaxResponse('onDemandLoadProfile', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    $('.customer-info-tabs li.tab a[href="#load-profile"]').tab('show');
}

// function onDemandClockRead(reference_number) {
//     getPinAndCallFunction(function(pin) {
//         ajax_object = ajx({
//             type: 'post',
//             url: window.base_url + '/admin/on-demand-clock-read',
//             data: { 'reference_number': reference_number, '_pin': pin },
//         })
//         createModalAndLoadAjaxResponse('onDemandClockRead', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
//     });
// }

function onDemandEventRead(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-event-read',
        data: { 'reference_number': reference_number },
    })
    createModalAndLoadAjaxResponse('onDemandEventRead', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    $('.customer-info-tabs li.tab a[href="#all-eventsalarms"]').tab('show');
}

function onDemandMeterVisuals(reference_number) {
    ajax_object = ajx({
        type: 'post',
        url: window.base_url + '/admin/on-demand-meter-visuals',
        data: { 'reference_number': reference_number },
    });
    createModalAndLoadAjaxResponse('onDemandMeterVisuals', window.please_wait_loader_html, ajax_object, null, 'modal-md');
}

function onDemandDeviceCommunicationHistory(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-device-communication-history',
            data: { 'reference_number': reference_number, '_pin': pin },
        });
        createModalAndLoadAjaxResponse('onDemandDeviceCommunicationHistory', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

function onDemandParameterRead(reference_number, request_type_idt) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-parameter-read',
            data: {
                reference_number: reference_number,
                type: request_type_idt,
                _pin: pin
            },
        })
        createModalAndLoadAjaxResponse('onDemandAuxiliaryRelayStatus', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

function onDemandDeviceTime(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-device-time',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandDeviceTime', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedSanctionedLoad(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-sanctioned-load',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedSanctionedLoad', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedLoadSheddingSchedule(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-load-shedding-schedule',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedLoadSheddingSchedule', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedTimeofUse(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-time-of-use',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedTimeofUse', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedIPAndPort(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-ip-and-port',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedIPAndPort', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedMeterDataSampling(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-meter-data-sampling',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedMeterDataSampling', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedOpticalPort(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-optical-port',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedOpticalPort', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandProgrammedWakeupSIMNumber(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-programmed-wake-up-sim-number',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandProgrammedWakeupSIMNumber', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandMeterStatus(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-meter-status',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandMeterStatus', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

function onDemandDeviceMetaData(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-device-meta-data',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandDeviceMetaData', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
    });
}

// function onDemandTariffRead(reference_number) {
//     getPinAndCallFunction(function(pin) {
//         ajax_object = ajx({
//             type: 'post',
//             url: window.base_url + '/admin/on-demand-tariff-read',
//             data: { 'reference_number': reference_number, '_pin': pin },
//         })
//         createModalAndLoadAjaxResponse('onDemandTariffRead', window.please_wait_loader_html, ajax_object, null, 'modal-lg');
//     });
// }

function onDemandContactorOn(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-contactor-on',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandContactorOn', window.please_wait_loader_html, ajax_object, null, 'modal-md', 'h4', 'Aux/Relay On - Connect');
    });
}

function onDemandContactorOff(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-contactor-off',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandContactorOff', window.please_wait_loader_html, ajax_object, null, 'modal-md', 'h4', 'Aux/Relay Off - Disconnect');
    });
}

function onDemandChangeOfSanctionLoad(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-change-of-sanction-load',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandChangeOfSanctionLoad', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

// function onDemandChangeOfTariff(reference_number) {
//     getPinAndCallFunction(function(pin) {
//
//         ajax_object = ajx({
//             type: 'post',
//             url: window.base_url + '/admin/on-demand-change-of-tariff',
//             data: { 'reference_number': reference_number, '_pin': pin },
//         })
//
//         createModalAndLoadAjaxResponse('onDemandChangeOfTariff', window.please_wait_loader_html, ajax_object, null, 'modal-md');
//
//     });
// }

function onDemandChangeOfReading(reference_number) {
    getPinAndCallFunction(function (pin) {

        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-change-of-reading',
            data: { 'reference_number': reference_number, '_pin': pin },
        })

        createModalAndLoadAjaxResponse('onDemandChangeOfReading', window.please_wait_loader_html, ajax_object, null, 'modal-md');

    });
}

function onDemandChangeOfIPandPort(reference_number) {
    getPinAndCallFunction(function (pin) {

        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-change-of-ip-and-port',
            data: { 'reference_number': reference_number, '_pin': pin },
        })

        createModalAndLoadAjaxResponse('onDemandChangeOfIPandPort', window.please_wait_loader_html, ajax_object, null, 'modal-md');

    });
}

// function onDemandChangeOfMDIreset(reference_number) {
//     getPinAndCallFunction(function(pin) {
//
//         ajax_object = ajx({
//             type: 'post',
//             url: window.base_url + '/admin/on-demand-change-of-mdi-reset',
//             data: { 'reference_number': reference_number, '_pin': pin },
//         })
//
//         createModalAndLoadAjaxResponse('onDemandChangeOfMDIreset', window.please_wait_loader_html, ajax_object, null, 'modal-md');
//
//     });
// }

// function onDemandChangeOfMode(reference_number) {
//     getPinAndCallFunction(function(pin) {
//
//         ajax_object = ajx({
//             type: 'post',
//             url: window.base_url + '/admin/on-demand-change-of-mode',
//             data: { 'reference_number': reference_number, '_pin': pin },
//         })
//
//         createModalAndLoadAjaxResponse('onDemandChangeOfMode', window.please_wait_loader_html, ajax_object, null, 'modal-md');
//
//     });
// }

function onDemandChangeOfLoadSheddingSchedule(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-time-sync',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandTimeSync', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

function onDemandTimeSync(reference_number) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-time-sync',
            data: { 'reference_number': reference_number, '_pin': pin },
        })
        createModalAndLoadAjaxResponse('onDemandTimeSync', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

function onDemandJobsList() {
    createModalAndLoadUrl(
        'on_demand_jobs_list',
        window.please_wait_loader_html,
        window.base_url + '/admin/on_demand_jobs_list?org_id=' + window.active_organization_id,
        function () { },
        'modal-xl', '', '', 'export'
    );
}

function onDemandWrite(reference_number, type) {
    getPinAndCallFunction(function (pin) {
        ajax_object = ajx({
            type: 'post',
            url: window.base_url + '/admin/on-demand-write',
            data: {
                'reference_number': reference_number,
                'type': type,
                '_pin': pin
            },
        })
        createModalAndLoadAjaxResponse('onDemandWrite', window.please_wait_loader_html, ajax_object, null, 'modal-md');
    });
}

function bulkAPMSConfigurations(type) {
    createModalAndLoadUrl('bulk-apms-configurations', window.please_wait_loader_html, window.base_url + '/admin/bulk_apms_configurations?type=' + type, function () { }, 'modal-xl');
}

function bulkContactorOnOff() {
    createModalAndLoadUrl('bulk-contactor-on-off', window.please_wait_loader_html, window.base_url + '/admin/bulk_contactor_on_off?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulkLoadSheddingSchedule() {
    createModalAndLoadUrl('load-shedding-schedule', window.please_wait_loader_html, window.base_url + '/admin/bulk_load_shedding_schedule?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulkLoadControlFunction() {
    createModalAndLoadUrl('bulk-sanctioned-load-control', window.please_wait_loader_html, window.base_url + '/admin/bulk_sanctioned_load_control?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_time_synchornization() {
    createModalAndLoadUrl('bulk_time_synchornization', window.please_wait_loader_html, window.base_url + '/admin/bulk_time_synchornization?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_time_of_use() {
    createModalAndLoadUrl('bulk_update_time_of_use', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_time_of_use?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_ip_and_port() {
    createModalAndLoadUrl('bulk_update_ip_and_port', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_ip_and_port?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_meter_data_sampling() {
    createModalAndLoadUrl('bulk_update_meter_data_sampling', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_meter_data_sampling?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_activate_meter_optical_port() {
    createModalAndLoadUrl('bulk_activate_meter_optical_port', window.please_wait_loader_html, window.base_url + '/admin/bulk_activate_meter_optical_port?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_wake_up_sim_number() {
    createModalAndLoadUrl('bulk_update_wake_up_sim_number', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_wake_up_sim_number?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_meter_status() {
    createModalAndLoadUrl('bulk_update_meter_status', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_meter_status?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_update_device_meta_data() {
    createModalAndLoadUrl('bulk_update_device_meta_data', window.please_wait_loader_html, window.base_url + '/admin/bulk_update_device_meta_data?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}

function bulk_reset_mdi_date_time() {
    createModalAndLoadUrl('bulk_reset_mdi_date_time', window.please_wait_loader_html, window.base_url + '/admin/bulk_reset_mdi_date_time?org_id=' + window.active_organization_id, function () { }, 'modal-xl');
}
