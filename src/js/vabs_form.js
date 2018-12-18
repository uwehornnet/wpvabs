const flatpickr = require("flatpickr");
const $ = require('jquery');
import rangePlugin from '../../node_modules/flatpickr/dist/plugins/rangePlugin.js';

/**
 * initialize Datepicker
 */
flatpickr('input[name="anreise"], input[name="abreise"]',{
	locale: {
		firstDayOfWeek: 1,
		weekdays: {
			shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
		},
		months: {
			shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
			longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
		}
	},
	minDate: new Date(),
	altInput: true,
	dateFormat: "Y-m-d",
	altFormat: "d.m.Y",
	plugins: [new rangePlugin({ input: 'input[name="abreise"]'})],
	onClose: function() {
		let dates = this.input.defaultValue.split(' to ');
		user.anreise = dates[0];
		user.abreise = dates[1];
	}
});


/**
 *
 * @type set main variables
 */
const vabs = document.querySelector('.vabs');
const lang = document.getElementById('vabs_shorcode_lang').value;
const stepOne = document.getElementById('vabs__course--selector');
const stepTwo = document.getElementById('vabs_booking_step_two');
const stepThree = document.getElementById('vabs_booking_step_three');
const form = $('#vabs_persdata input, #vabs_persdata textarea');
const button = document.querySelector('.vabs__button');
const url = vabs_obj.ajax_url + 'handler.php';

/**
 *
 * @type string = Title of Cart
 */
let step = 'vabs__course--selector';

/**
 *
 * @type name of differnt steps
 */
const steps = [
	'vabs__course--selector',
	'vabs__quantity--selector',
	'vabs__persdata--selector',
	'vabs__confirm',
	'vabs__submit'
];


/**
 *
 * @type {{title: string, price: {value: null, unit: null}}}
 */
let cart = {
	title: 'Booking API',
	price: {
		value: null,
		unit: null
	}
};

/**
 *
 * @type user object
 */
let user = {
	id: null
};

/**
 *
 * @type {{id: null, qty: number, priceObj: {}}}
 */
let course = {
	id: null,
	qty: 1,
	name: null,
	anzStunden: 0,
	minBookableAmount: 0,
	priceObj: {}
};

/**
 * Initialize Frontend Booking Cart
 */
$('document').ready(
	init()
);




/**
 * init plugin
 */
function init() {

	const data = {
		id: document.getElementById('vabs-form-type').value
	};

	let response = ApiCall(document.getElementById('vabs-form-type').name, data);

	if(JSON.parse(response)){
		updateStep(1)

		const courses = JSON.parse(response);

		for(var key in courses){
			var course = courses[key];

			course.details = JSON.parse(ApiCall('get_course_details', {
				id: course.id,
				qty: course.minBookableAmount
			}));
		}

		AppendElements(courses, stepOne)
		setHight(stepOne)
	}
}


/**
 * change selected course object
 */
$('input[name="course"]').on('change', function() {

	course.id = this.value;
	course.qty = this.dataset.qty;
	course.name = this.dataset.title;

	const data = {
		id: this.value,
		qty: this.dataset.qty
	};

	let priceObj = ApiCall('get_course_details', data);
	course.priceObj = JSON.parse(priceObj);

	document.querySelector('#vabs__quantity--input').value = course.qty;
	console.log(parseInt(course.qty) > 1);
	if(parseInt(course.qty) > 1){
		document.querySelector('#vabs__quantity--input').disabled = true;
	}else{
		document.querySelector('#vabs__quantity--input').disabled = false;
	}
	document.querySelector('.vabs__cart--header .title').innerHTML = course.name;
	document.querySelector('.vabs__cart--header .meta__price').innerHTML = parseFloat(course.priceObj.price).toFixed(2);
	document.querySelector('.vabs__cart--header .meta__unit').innerHTML = ' €';
});


/**
 * change qty of selected course
 */
$('#vabs__quantity--input').on('change', function() {
	course.qty = this.value;

	const data = {
		id: course.id,
		qty: this.value
	};

	let priceObj = ApiCall('get_course_details', data);
	course.priceObj = JSON.parse(priceObj);
	document.querySelector('.vabs__cart--header .meta__price').innerHTML = parseFloat(course.priceObj.price).toFixed(2);
});

/**
 * handle functions every time the button get clicked
 */
document.querySelector('.vabs__button').addEventListener('click', function(e) {
	e.preventDefault();

	if(e.target.dataset.target === steps[1])
	{
		if(course.id){
			// open quantity section
			document.querySelector('#vabs__quantity--selector').style.maxHeight = document.querySelector('#vabs__quantity--selector').scrollHeight + 'px';
			updateStep(2)
		}

	}
	else if(e.target.dataset.target === steps[2])
	{
		// open persdata section
		document.querySelector('#vabs__persdata--selector').style.maxHeight = document.querySelector('#vabs__persdata--selector').scrollHeight + 'px';

		updateStep(3)
	}
	else if(e.target.dataset.target === steps[3])
	{
		console.log(user)
		form.each(function() {
			if(this.value != '' || this.value != 'weiter' || this.name != 'vabs_shorcode_lang' || this.name != 'anreise' || this.name != 'abreise') {
				user[this.name] = this.value;
			}
		});

		let validation = validateForm()

		console.log(validation);

		if(validation) {
			updateStep(4)
			openConfirmation()
		}
	}
	else if(e.target.dataset.target === steps[4])
	{
		vabs.classList.add('loading');

		setTimeout(function() {
			let CallResponse = submitForm();
			if(CallResponse) {
				openThankYouPage();
				vabs.classList.remove('loading');
			}
		}, 700);
	}

});


/**
 *
 * @param method = call php function
 * @param data = form data which need to get posted
 * @returns response object
 */
function ApiCall(method, data){
	let answer = null;

	$.ajax({
		method: "POST",
		url: url + '?method=' + method,
		async: false,
		data: data,
		success: function (response) {
			answer = response;
		},
		error: function (error) {
			answer = error;
		}
	});

	return answer;
}

/**
 *
 * @returns boolean = if validation fails
 */
function validateForm() {

	let validate = false;

	if(!user.firstname || !user.lastname || !user.email || !user.mobile || !user.anreise || !user.abreise || !user.note){
		validate = false;
	}else{
		validate = true
	}

	if(!user.firstname){
		document.querySelector('input[name="firstname"]').classList.add('error')
	}else{
		document.querySelector('input[name="firstname"]').classList.remove('error')
	}

	if(!user.lastname){
		document.querySelector('input[name="lastname"]').classList.add('error')
	}else{
		document.querySelector('input[name="lastname"]').classList.remove('error')
	}

	if(!user.email){
		document.querySelector('input[name="email"]').classList.add('error')
	}else{
		document.querySelector('input[name="email"]').classList.remove('error')
	}

	if(!user.mobile){
		document.querySelector('input[name="mobile"]').classList.add('error')
	}else{
		document.querySelector('input[name="mobile"]').classList.remove('error')
	}

	if(!user.anreise){
		document.querySelector('input[name="anreise"]').nextSibling.classList.add('error')
	}else{
		document.querySelector('input[name="anreise"]').nextSibling.classList.remove('error')
	}

	if(!user.abreise){
		document.querySelector('input[name="abreise"]').classList.add('error')
	}else{
		document.querySelector('input[name="abreise"]').classList.remove('error')
	}

	if(!user.note){
		document.querySelector('textarea').classList.add('error')
	}else{
		document.querySelector('textarea').classList.remove('error')
	}

	return validate;
}

/**
 * Open confirmation section, based on validation
 */
function openConfirmation() {
	const cart = document.querySelector('.vabs__cart--body');
	const confirmation = document.querySelector('.vabs__cart--confirmation');
	const stepper = document.querySelector('.vabs__stepper');

	let dates = user.anreise.split(' to ');
	user.anreise = dates[0];
	user.abreise = dates[1];

	confirmation.querySelector('.firstname').innerHTML = user.firstname;
	confirmation.querySelector('.lastname').innerHTML = user.lastname;
	confirmation.querySelector('.mobile').innerHTML = user.mobile;
	confirmation.querySelector('.email').innerHTML = user.email;
	confirmation.querySelector('.note').innerHTML = user.note;
	confirmation.querySelector('.daterange--arrival').innerHTML = humanReadableDate(new Date(user.anreise));
	confirmation.querySelector('.daterange--departure').innerHTML = humanReadableDate(new Date(user.abreise));
	confirmation.querySelector('.course--title').innerHTML = course.name;
	confirmation.querySelector('.qty').innerHTML = course.qty;
	confirmation.querySelector('.course--price').innerHTML = parseFloat(course.priceObj.price).toFixed(2) + ' €';

	stepper.style.maxHeight = '0px';
	cart.style.maxHeight = confirmation.scrollHeight + 'px';
	confirmation.style.maxHeight = confirmation.scrollHeight + 'px';

}

/**
 *
 */
function openThankYouPage() {

	const cart = document.querySelector('.vabs__cart--body');
	const confirmation = document.querySelector('.vabs__cart--confirmation');
	const thx = document.querySelector('.vabs__cart--thankyou');

	document.querySelector('.vabs__cart--header .title').innerHTML = JSON.parse(vabs_obj.lang)[lang]['cart_thankyou_title'];
	document.querySelector('.vabs__cart--header .meta__price').innerHTML = null;
	document.querySelector('.vabs__cart--header .meta__unit').innerHTML = null;
	document.querySelector('.vabs__button').style.display = 'none';
	confirmation.style.maxHeight = '0px';
	cart.style.maxHeight = thx.scrollHeight + 'px';
	thx.style.maxHeight = thx.scrollHeight + 'px';
	thx.querySelector('.thankyou__svg').classList.add('success');

}

/**
 * submitting booking form
 */
function submitForm() {

	// generate new contact
	const contact = ApiCall('create_new_contact', user);

	// generate new lead
	const LeadData = {
		contact_id: JSON.parse(contact).contact_id,
		shorttext: user.note
	}
	const lead = ApiCall('create_new_lead', LeadData);


	// generate new sales_order
	const salesOrderData = {
		contact_id: JSON.parse(contact).contact_id,
		shorttext: user.note
	};
	const salesOrder = ApiCall('add_sales_order', salesOrderData);


	// generate new sales_line
	const salesLineData = {
		sales_order_id: JSON.parse(salesOrder).sales_header_id,
		object_id: course.id,
		quantity: course.qty,
		date_from: user.anreise,
		date_to: user.abreise
	};
	const salesLine = ApiCall('add_sales_line', salesLineData);

	return salesLine;

}

/**
 *
 * @param value = step which is called next
 */
function updateStep(value) {
	step = steps[value];
	button.dataset.target = step;
	button.innerHTML = JSON.parse(vabs_obj.lang)[lang]['button_step_' + value];
}

/**
 *
 * @param date
 * @returns {string}
 */
function humanReadableDate(date) {
	let monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

	let day = date.getDate();
	let monthIndex = date.getMonth();
	let year = date.getFullYear();

	return day + '. ' + monthNames[monthIndex] + ' ' + year;
}

/**
 *
 * @param data = response data from API call
 * @param element = which element to append
 */
function AppendElements(data, element) {
	for(var i = 0; i < data.length; i++){
		var course = data[i]

		var content = document.createElement('div');
		content.classList.add('courses__list--course');
		var label = document.createElement('label');
		label.innerHTML = '<input type="radio" name="course" class="from__field--radio" data-qty="' + course.minBookableAmount + '" data-title="' + course.name + '" value="' + course.id + '"><span><strong>' + course.name + '</strong><small>' + course.kurz_beschreibung + '</small></span><span><strong>' + course.minBookableAmount + ' Tag(e)</strong><small>' + course.anzStunden + ' Stunde(n)</small></span><span class="price">' + parseFloat(course.details.price).toFixed(2) + '€</span>';
		content.append(label);
		element.querySelector('.courses__list').append(content);
	}
}

/**
 *
 * @param element = which element need to get modified
 */
function setHight(element) {
	vabs.querySelector('#vabs__course--selector').style.height = element.scrollHeight + 'px';
}
