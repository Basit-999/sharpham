$(".selectBox").on("click", function (e) {
	$(this).toggleClass("show")
	var dropdownItem = e.target
	var container = $(this).find(".selectBox__value")
	container.text(dropdownItem.text)
	$(dropdownItem).addClass("active").siblings().removeClass("active")
})

// $( document ).ready(function() {
//     if ($(".cart_product_json")[0]) {
//       var availability = $(".cart_product_json").text();
//       availability = JSON.parse(availability);
//       let start_date = $(".cart_product_json").data('start');
//       let end_date = $(".cart_product_json").data('end');
//       var available = 0;
//       console.log('start_date', start_date, end_date);

//       for(var i=0; i < availability.length; i++){
//         if(start_date === availability[i].start){
//           available = availability[i].Available;
//           $("#Quantity-" + line + "").attr('max', available);
//         }
//       }
// 	}
// });

var firstJson
var enableDate = new Array(),
	disableDate = new Array()
$(function () {
	$("#wrapper .version strong").text("v" + $.fn.pignoseCalendar.version)

	function onSelectHandler(date, context) {
		$(".dates_div").addClass("notAllowed")
		$(".persons_div").addClass("notAllowed")
		$(".times_div").addClass("notAllowed")
		var $element = context.element
		var $calendar = context.calendar
		console.log({ date, context })
		var $box = $element.siblings(".box").show()
		var text = "You selected date "
		if (date[0] !== null) {
			text += date[0].format("YYYY-MM-DD")
		}

		if (date[0] !== null && date[1] !== null) {
			text += " ~ "
		} else if (date[0] === null && date[1] == null) {
			text += "nothing"
		}

		if (date[1] !== null) {
			text += date[1].format("YYYY-MM-DD")
		}
		if (date[0] !== null) {
			dataMaker(date[0].format("YYYY-MM-DD"))
		}
		$box.text(text)
	}

	function onApplyHandler(date, context) {
		/**
		 * @date is an array which be included dates(clicked date at first index)
		 * @context is an object which stored calendar interal data.
		 * @context.calendar is a root element reference.
		 * @context.calendar is a calendar element reference.
		 * @context.storage.activeDates is all toggled data, If you use toggle type calendar.
		 * @context.storage.events is all events associated to this date
		 */

		var $element = context.element
		var $calendar = context.calendar
		var $box = $element.siblings(".box").show()
		var text = "You applied date "

		if (date[0] !== null) {
			text += date[0].format("YYYY-MM-DD")
		}

		if (date[0] !== null && date[1] !== null) {
			text += " ~ "
		} else if (date[0] === null && date[1] == null) {
			text += "nothing"
		}

		if (date[1] !== null) {
			text += date[1].format("YYYY-MM-DD")
		}

		$box.text(text)
	}

	if ($(".product_json")[0]) {
		firstJson = $(".product_json").text()
		firstJson = JSON.parse(firstJson)
		var totalPerson = 0
		var maxDate = new Date(
			moment(firstJson[firstJson.length - 1].start).format("YYYY-MM-DD")
		)


  
		const commingslots = firstJson?.filter((item) => {
			if (moment(item.start).isAfter(moment())) {
				return item
			}
		})

		const max_duration = commingslots.find((item) => {
			if (item) {
				const hoursDifference = moment(item.end).diff(moment(item.start))
				const maximum_duration = Math.max(hoursDifference)
				if (maximum_duration > 0) {
					return item
				}
			}
		})
		var firstSlotStart = moment(max_duration.start, "YYYY-MM-DD HH:mm:ss a")
		var firstSlotEnd = moment(max_duration.end, "YYYY-MM-DD HH:mm:ss a")

		var duration = moment.duration(firstSlotEnd.diff(firstSlotStart))
		var hours = parseInt(duration.asHours())
		var minutes = parseInt(duration.asMinutes()) % 60

            const bookedPersons = document.querySelector("#booking_person")

		const Adults = bookedPersons?.innerText.split(" ")[0]
      
		for (var i = 0; i < firstJson.length; i++) {
			var fulldate = new Date(firstJson[i].start)
			var enddate = new Date(firstJson[i].end)

			if (fulldate < new Date()) {
				continue
			}
          

			if (parseInt(firstJson[i].Total) > parseInt(totalPerson)) {
				totalPerson = firstJson[i].Total
			}

			if (parseInt(firstJson[i].Available) > 0) {      
				enableDate.push(moment(fulldate).format("YYYY-MM-DD"))
			} else {
				var dateArray = {
					name: "offer",
					date: moment(fulldate).format("YYYY-MM-DD"),
				}
				disableDate.push(dateArray)
			}
		}

		$(".total_bookable_person").text(`Up to ${totalPerson} People`)
		$(".total_bookable_duration").text(`${hours} hour ${minutes} minutes`)

		disableDate = disableDate.filter(function (val) {
			return enableDate.indexOf(val.date) == -1
		})

		var minDate = moment().set().format("YYYY-MM-DD")
		// Multiple picker type Calendar
		$(".multi-select-calendar").pignoseCalendar({
			select: onSelectHandler,
			initialize: false,
			minDate,
			maxDate,
			enabledDates: enableDate,
			scheduleOptions: {
				colors: {
					offer: "transparent",
				},
			},
			schedules: disableDate,
          prev: function(info, context) {
            
                setTimeout(function () {    
                    $(
                        ".pignose-calendar-button-schedule-pin-offer"
                    )
                        .parent()
                        .parent()
                        .find("a")
                        .addClass("disabled-Color");
                    //console.log('After Previous');
                },500);
                
            },
            next: function(info, context) {
        
                setTimeout(function () {    
                    $(
                        ".pignose-calendar-button-schedule-pin-offer"
                    )
                        .parent()
                        .parent()
                        .find("a")
                        .addClass("disabled-Color");
                    //console.log('After Next');
                },500);
                
            },





		})

		$(
			".pignose-calendar-button-schedule-pin.pignose-calendar-button-schedule-pin-offer"
		)
			.parent()
			.parent()
			.find("a")
			.addClass("disabled-Color")
	}
})
function formatAMPM(date) {
	var hours = date.getHours()
	var minutes = date.getMinutes()
	var ampm = hours >= 12 ? "pm" : "am"
	hours = hours % 12
	hours = hours ? hours : 12 // the hour '0' should be '12'
	minutes = minutes < 10 ? "0" + minutes : minutes
	var strTime = hours + ":" + minutes + " " + ampm
	return strTime
}

var timesArray = [],
	datesAvailable,
	month,
	year,
	day,
	year1,
	month1,
	day1,
	calenderJson,
	getEndDate,
	getStartDate

function dataMaker(date1) {
	timesArray = []
	year1 = date1.substring(0, 4)
	month1 = date1.substring(5, 7)
	day1 = date1.substring(8, 10)
	selectDate = new Date(date1)
	for (var i = 0; i < firstJson.length; i++) {
		var dateStart = new Date(firstJson[i].start)

		const selectedDate = moment(selectDate).format("YYYY-MM-DD")
		const startedDate = moment(dateStart).format("YYYY-MM-DD")

		if (moment(selectedDate).isSame(startedDate, "day")) {
			timesArray.push(firstJson[i])
			datesAvailable = new Date(firstJson[i].start)
		}
	}

	console.log({ timesArray })
	$(".calendr").find("#available_time").html("")
	let monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]

	$(".calendr")
		.find("#available_date_selected")
		.text(
			monthNames[datesAvailable.getMonth()] +
				", " +
				datesAvailable.getDate() +
				", " +
				datesAvailable.getFullYear()
		)

	$(".calendr").find("input[name='properties[start]']").val(timesArray[0].start)
	$(".calendr").find("input[name='properties[end]']").val(timesArray[0].end)

	getEndDate = new Date(timesArray["0"].end)
	getStartDate = new Date(timesArray["0"].start)

	$("#available_time_selected").text(
		formatAMPM(new Date(getStartDate)) + " - " + formatAMPM(new Date(getEndDate))
	)
	$(".calendr")
		.find("input[name='properties[Time]']")
		.val(
			formatAMPM(new Date(getStartDate)) + " - " + formatAMPM(new Date(getEndDate))
		)
	$(".calendr").find("input[name='properties[Id]']").val(timesArray["0"].id)

	$("#available_person").html("")

	for (let i = 1; i <= parseInt(timesArray["0"].Available); i++) {
		if (i === 1) {
			$("#available_person").append(
				'<a  data-qty="' +
					i +
					'" data-selectPerson=' +
					i +
					' Adult" href="javascript:void(0)" class="dropdown-item active person_dropdown_list">' +
					i +
					" Adult</a>"
			)
		} else {
			$("#available_person").append(
				'<a  data-qty="' +
					i +
					'" data-selectPerson="' +
					i +
					' Adults" href="javascript:void(0)" class="dropdown-item person_dropdown_list">' +
					i +
					" Adults</a>"
			)
		}
	}

	for (var i = 0; i < timesArray.length; i++) {
		console.log(formatAMPM(new Date(getStartDate)))
		getEndDate = new Date(timesArray[i].end)
		getStartDate = new Date(timesArray[i].start)
		$("#available_time").append(
			'<a data-booking="' +
				timesArray[i].id +
				'" data-start=' +
				timesArray[i].start +
				" data-end=" +
				timesArray[i].end +
				" data-person=" +
				parseInt(timesArray[i].Available) +
				' data-time="' +
				formatAMPM(new Date(getStartDate)) +
				"-" +
				formatAMPM(new Date(getEndDate)) +
				'"  href="javascript:void(0)" class="dropdown-item time_dropdown_item">' +
				formatAMPM(new Date(getStartDate)) +
				" - " +
				formatAMPM(new Date(getEndDate)) +
				"</a>"
		)
	}

	$(".dates_div").removeClass("notAllowed")
	$(".times_div").removeClass("notAllowed")
	$(".persons_div").removeClass("notAllowed")
	$(".book-tour").removeClass("notAllowed")
	if (parseInt(timesArray["0"].Available) > 0) {
		$("#available_person_selected").text("1 Adult")
		$(".calendr").find("input[name='properties[Persons]']").val("1 Adult")
	} else {
		$("#available_person_selected").text("0 Adult")
		$(".calendr").find("input[name='properties[Persons]']").val("0 Adult")
		$(".book-tour").addClass("notAllowed")
	}
}

$("body").on("click", ".time_dropdown_item", function () {
	var start = $(this).attr("data-start")
	var end = $(this).attr("data-end")
	var personCount = $(this).attr("data-person")
	var timeSelected = $(this).attr("data-time")
	var bookingID = $(this).attr("data-booking")
	$(".calendr").find("input[name='properties[start]']").val(start)
	$(".calendr").find("input[name='properties[end]']").val(end)
	$(".calendr").find("input[name='properties[Time]']").val(timeSelected)
	$(".calendr").find("input[name='properties[Persons]']").val(personCount)
	$(".calendr").find("input[name='properties[Id]']").val(bookingID)

	$("#available_person").html("")
	if (personCount > 0) {
		$("#available_person_selected").text("1 Adult")
		$(".calendr").find("input[name='properties[Persons]']").val("1 Adult")
		$(".book-tour").removeClass("notAllowed")
	} else {
		$("#available_person_selected").text("0 Adult")
		$(".calendr").find("input[name='properties[Persons]']").val("0 Adult")
		$(".book-tour").addClass("notAllowed")
	}

	for (let i = 1; i <= personCount; i++) {
		if (i === 1) {
			$("#available_person").append(
				'<a  data-qty="' +
					i +
					'" data-selectPerson=' +
					i +
					' Adult" href="javascript:void(0)" class="dropdown-item active person_dropdown_list">' +
					i +
					" Adult</a>"
			)
		} else {
			$("#available_person").append(
				'<a  data-qty="' +
					i +
					'" data-selectPerson="' +
					i +
					' Adults" href="javascript:void(0)" class="dropdown-item person_dropdown_list">' +
					i +
					" Adults</a>"
			)
		}
	}
})

$("body").on("click", ".person_dropdown_list", function () {
	$("input[name='properties[Persons]']").val($(this).attr("data-selectPerson"))
	var productPrice = parseInt($(".product_price_calender").attr("data-price"))
	$(".product_price_calender").text(
		"Rs. " + productPrice * parseInt($(this).attr("data-qty"))
	)
	$("input[name='quantity']").val($(this).attr("data-qty"))
})
$(".owl-carousel").owlCarousel({
	stagePadding: 0,
	loop: true,
	margin: 20,
	nav: true,
	navText: [
		'<div class="nav-btn prev-slide"><img src="https://cdn.shopify.com/s/files/1/0605/5493/6512/files/long-arrow-left.svg?v=1642405236" class="img-fluid"></div>',
		'<div class="nav-btn next-slide"><img src="https://cdn.shopify.com/s/files/1/0605/5493/6512/files/long-arrow.svg?v=1642405236" class="img-fluid"></div>',
	],
	responsive: {
		0: {
			items: 1,
		},
		600: {
			items: 3,
		},
		1000: {
			items: 4,
		},
	},
})
$("body").on("click", ".book-tour_booking", function (e) {
	var form = $(this).parent("form")
	var variantId = $(form).find("input[name='id']").val()
	console.log("variantId", variantId)
	$.ajax({
		type: "POST",
		url: "/cart/change.js",
		data: { quantity: 0, id: variantId },
		dataType: "json",
		async: true,
		success: function (cart) {
			$(form).submit()
		},
	})
})

$("body").on("click", ".gift-btn-popup", function (e) {
	var form = $(this).parent().parent().parent()
	var variantId = $(form).find("input[name='id']").val()

	$.ajax({
		type: "POST",
		url: "/cart/change.js",
		data: { quantity: 0, id: variantId },
		dataType: "json",
		async: true,
		success: function (cart) {
			$(form).submit()
		},
	})
})


$(function () {
	if ($('.terms_checkbox').prop("checked") == true) {
		$(".cart__checkout-button").removeClass("notAllowed")
	} else if ($('.terms_checkbox').prop("checked") == false) {
		$(".cart__checkout-button").addClass("notAllowed")
	}
})

$("body").on("click", ".terms_checkbox", function () {
	if ($(this).prop("checked") == true) {
		$(".cart__checkout-button").removeClass("notAllowed")
	} else if ($(this).prop("checked") == false) {
		$(".cart__checkout-button").addClass("notAllowed")
	}
})

$("body").on("click", ".minus_plus_master", function () {
	var quantityVal = parseInt(
		$(this).parent(".sp-quantity").find(".quntity-input").val()
	)
	if ($(this).hasClass("sp-plus")) {
		quantityVal = quantityVal + 1
	}
	if ($(this).hasClass("sp-minus")) {
		if (2 <= quantityVal) {
			quantityVal = quantityVal - 1
		}
	}

	var price = $("#price").attr("data-price")
	console.log(price * quantityVal)
	$(this).parent(".sp-quantity").find(".quntity-input").val(quantityVal)
	$("#price").text(currentCurrent + " " + price * quantityVal)
})

$("body").on("change", ".quntity-input", function () {
	var quantityVal = parseInt($(this).val())
	var price = $("#price").attr("data-price")
	console.log(price * quantityVal)
	$(this).parent(".sp-quantity").find(".quntity-input").val(quantityVal)
	$("#price").text(currentCurrent + " " + price * quantityVal)
})

$("body").on("click", "#gift_message", function () {
	if ($("input#gift_message").is(":checked")) {
		console.log("Add Message")
		$("#MessageModal").addClass("show")
		$("#MessageModal").show()
		$("body").addClass("modal-open")
	}
})
$("body").on("click", ".message_modal_close", function (e) {
	e.preventDefault()
	$("#MessageModal").removeClass("show")
	$("#MessageModal").hide()
	$("body").removeClass("modal-open")
})
$("body").on("click", ".confirm_gift_message", function (e) {
	e.preventDefault()
	$(".form_gift_message").val($(".gift_message").val())
	$("#MessageModal").removeClass("show")
	$("#MessageModal").hide()
	$("body").removeClass("modal-open")
})

$("body").on("click", ".change_booking_order", function (e) {
	var dataId = $(this).attr("data-id")
	$("#change_booking_" + dataId).slideDown()
	$(".order_master_div").slideUp()
})
// Max Code Start.
$("body").on("click", ".change_booking_master", function (e) {
	//var dataId = $(this).attr("data-id");
	//$(".change_booking_master").slideUp();
	//$(".order_master_div").slideDown();
})
$("body").on("click", ".close_change_booking", function (e) {
	$(".order_master_div").slideDown()
	$(".change_booking_master").slideUp()
})
// Max code end.

$("body").on("click", ".update_tour", function (e) {
	e.preventDefault()
	var metaFieldId
	var startTiming = $(this)
		.parent(".form_attributes")
		.find("input[name='properties[start]']")
		.val()
	var endTiming = $(this)
		.parent(".form_attributes")
		.find("input[name='properties[end]']")
		.val()
	var id = $(this)
		.parent(".form_attributes")
		.find("input[name='properties[Id]']")
		.val()
	var time = $(this)
		.parent(".form_attributes")
		.find("input[name='properties[Time]']")
		.val()
	var orderId = $(this).attr("data-id")
	var lineItemId = $(this)
		.parent(".form_attributes")
		.find("input[name='id']")
		.val()
	// return;
	var metaJson =
		'[{"id":"' +
		id +
		'", "line_item":  "' +
		lineItemId +
		'" , "startTiming": "' +
		startTiming +
		'", "endTiming": "' +
		endTiming +
		'", "time": "' +
		time +
		"}]"
	jQuery.ajax({
		type: "POST",
		url: "https://maxenius.agency/aliyan/public/getOrder",
		dataType: "json",
		async: true,
		data: { order_number: orderId },
		success: function (data) {
			console.log(data.metafields)
			for (var i = 0; i < data.metafields.length; i++) {
				if (data.metafields[i].key === "meta") {
					metaFieldId = data.metafields[i].id
				}
			}
			console.log(metaFieldId)
			jQuery.ajax({
				type: "POST",
				url: "https://maxenius.agency/aliyan/public/updateOrder",
				dataType: "json",
				data: {
					order_number: orderId,
					metaFieldId: metaFieldId,
					metaJson: metaJson,
				},
				success: function (data) {
					console.log(data)
					window.location.href = "/account"
				},
			})
			// window.location.href= "/account";
		},
	})
})

$("body").on("click", ".order_delete", function () {
    $("#cancel-booking-loader").show();
    $(".order_delete").prop('disabled', true);
	var order_id = $(this).attr("data-id")

	jQuery.ajax({
		type: "POST",
		url: `https://maxeniussolutions.myshopify.com/apps/proxy/customer-cancel-order?order_id=${order_id}`,
		dataType: "json",
		success: function (data) {
			//window.location.href = "/account"
          window.location.reload()
		},
        finally: function (data) {
          $("#cancel-booking-loader").hide();
          $(".order_delete").prop('disabled', false);
		}
	})
})

$("body").on("click", "#order_change_booking", function () {
	$("#change-booking-loader").show();
    $("#order_change_booking").prop('disabled', true);
  
    var order_id = $(this).data("order-id");
	var slot_id = $("#slot_id").val();
  
    var message = "";
	jQuery.ajax({
		type: "POST",
		url: `https://maxeniussolutions.myshopify.com/apps/proxy/customer-move-booking?oldOrderId=${order_id}&slotId=${slot_id}`,
		success: function (data) {
          message = "Booking changed successfully"
		},
        error: function (data) {
          message = "Something went wrong. Please retry or contact support"
		},
        finally: function (data) {
          $("#change-booking-loader").hide();
          $("#order_change_booking").prop('disabled', false);
		}
	})

     $('#notify_msg').html("data insert successfully").fadeIn('slow')
     $('#notify_msg').delay(5000).fadeOut('slow')
      setTimeout(
      function() 
      {
        window.location.reload()
      }, 2000);
})

$("body").on("click", ".single_voucher_confirm", function () {
	$("#voucher_product_id").val($("#product_id_voucher").attr("data-product"))
	$("#voucher_form").submit()
})
