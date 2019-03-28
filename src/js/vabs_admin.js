const version = '1.5';

const $ = require('jquery');
const url = vabs_ajax_obj.url + 'handler.php';

const trigger_one = document.querySelectorAll('input[name="page"]');
const step_two = document.getElementById('step_two');
const last_step = document.getElementById('last_step');
const final = document.getElementById('final');
const output_element = document.getElementById('vabs_shortcode_output_element');
const languages = document.querySelector('.vabs__formlist');
const langNav = document.querySelector('.navigation__links');
const links = document.querySelectorAll('.navigation__links--link');
const saveOptions = document.getElementById('save_main_options');


fetch(`https://api.github.com/repos/uwehornnet/wpvabs/releases`, {
	method: 'GET',
	headers: {
		"Content-Type": "application/json",
	},
}).then((response) => {
	return response.json();
}).then((response) => {
	if(version < parseFloat(response[0].tag_name.replace('v', ''))) {
		let template = document.createElement('div');

		let versions = '';
		response.forEach((v) => {
			versions += `<button data-target="${v.tag_name}">${ v.tag_name }</button>`;
		});
		template.classList.add('vabs_update_notification');
		template.innerHTML = `
			<strong>Updates available.</strong>
			<p>Your are running on ${version}, to stay up to date with the vabs api connection, we recommend you to update the latest version.</p>
			${versions}
		`;

		template.querySelectorAll('button').forEach((button) => {
			button.addEventListener('click', function(e) {
				updatePlugin(e.target.dataset.target.replace('v', ''))
			});
		});

		document.querySelector('body').append(template);
	}
})


if (saveOptions) {
	saveOptions.addEventListener('click', (event) => {
		event.preventDefault();
		const apiToken = document.querySelector('.vabs input[name="api_token"]').value;

		if (apiToken) {
			document.querySelector('.vabs .form__field .loading').style.display = 'inline-block';
		}

		fetch(`${url}?method=get_client_data`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({apiToken: apiToken, url: document.querySelector('.vabs input[name="url"]').value})
		}).then((response) => {
			return response.json();
		}).then((client) => {
			document.querySelector('.vabs input[name="dsgvo"]').value = client.dsgvo_doc_link;
			document.querySelector('.vabs input[name="agb"]').value = client.agbs_doc_link;

			setTimeout(() => {
				document.querySelector('.vabs form').submit();
			},300)

		})
	});
}

if (languages) {
	languages.firstElementChild.classList.add('active');
}

if (langNav) {
	langNav.firstElementChild.classList.add('active');
}

if (links) {
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function () {
			let id = this.dataset.target;

			$('.navigation__links--link').each(function () {
				this.classList.remove('active');
			});

			$('.vabs__formlist--form').each(function () {
				this.classList.remove('active');
			});

			this.classList.add('active');
			document.getElementById(id).classList.add('active');
		});
	}
}

let outputData = {
	courses: [],
	type: '',
	form: '',
	lang: 'de'
};

if (document.getElementById('generate_custom_vabs_shortcode')) {
	document.getElementById('generate_custom_vabs_shortcode').addEventListener('click', output);
}

for (var i = 0; i < trigger_one.length; i++) {
	trigger_one[i].addEventListener('change', changeStep)
}

$('.from__field--radio--lang').each(function () {
	this.addEventListener('change', function () {
		outputData.lang = this.value;
	});
});

function updatePlugin(version) {

	document.querySelector('.vabs_update_notification button').innerHTML = 'loading ...';

	fetch(`${url}?method=update`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({version: version})
	}).then((response) => {
		return response.json();
	}).then((response) => {
		if(response.status) {
			document.querySelector('.vabs_update_notification').innerHTML = `
				<p>${response.status}</p>
			`;

			setTimeout(function () {
				document.querySelector('.vabs_update_notification').remove();
			}, 3000);
		}

	});
}

function output() {
	outputData.courses = [];
	let courseInputList = document.querySelectorAll('input[name="course"]');
	courseInputList = Array.from(courseInputList).map((course) => {
		if (course.checked) {
			outputData.courses.push(course.value);
		}
	});

	output_element.value = '[vabs_booking form="' + outputData.form + '" type="' + outputData.type + '" query="' + outputData.courses + '" lang="' + outputData.lang + '"]';
}

function changeStep() {
	step_two.style.maxHeight = '0px';
	last_step.style.maxHeight = '0px';
	final.style.maxHeight = '0px';

	clearStep($('#step_two label'));
	clearStep($('#last_step label'));

	if (this.value === 'detail') {
		outputData.form = 'booking';
		outputData.type = 'course';
		getAllCourses()
	}

	if (this.value === 'allgemein') {
		outputData.form = 'booking';
		outputData.type = 'group';
		getCourseGroups()
	}

	if (this.value === 'contact') {
		outputData.form = 'contact';
		finalStep()
	}
}

function finalStep() {
	openElement(final);
}

function ApiCall(method, data) {
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

	if (method === 'get_all_courses')
		answer = groupBy(JSON.parse(answer), 'kurs_gruppen_name');

	return answer;
}

function getAllCourses() {
	const value = ApiCall('get_all_courses', {});
	appendElements(last_step, value);
	openElement(last_step);
}

function getCourseGroups() {
	const value = ApiCall('get_all_course_groups', {});
	appendElements(step_two, JSON.parse(value));
	openElement(step_two);
}

function appendElements(element, data) {

	if (data.constructor === Object) {
		for (var key in data) {
			clearStep($('#vabs_form_' + key));

			var group = document.createElement('div');
			group.id = 'vabs_group_' + key;
			group.innerHTML = '<p><strong>' + key + '</strong></p>';
			element.querySelector('.form__field').append(group);

			for (var i = 0; i < data[key].length; i++) {
				var course = data[key][i];
				var label = document.createElement('label');
				const desc = course.kurz_beschreibung ? course.kurz_beschreibung : '';
				label.innerHTML = '<input type="checkbox" name="course" class="from__field--radio" value="' + course.id + '"><span><strong>' + course.name + '</strong><small>' + desc + '</small></span>';
				document.getElementById('vabs_group_' + key).append(label);

				label.querySelector('input').addEventListener('change', finalStep);
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			var course = data[i]

			var label = document.createElement('label');
			label.style.display = 'block';
			label.style.margin = '14px 0px 14px 0px';
			const desc = course.kurz_beschreibung ? course.kurz_beschreibung : '';
			label.innerHTML = '<input type="radio" name="course" class="from__field--radio" value="' + course.id + '"><span><strong>' + course.name + '</strong><small>' + desc + '</small></span>';
			element.querySelector('.form__field').append(label);

			label.querySelector('input').addEventListener('change', finalStep);
		}
	}
}

function openElement(element) {
	element.style.maxHeight = element.scrollHeight + 'px';
}

function clearStep(step) {
	if (step) {
		step.each(function () {
			this.remove();
		});
	}
}

function groupBy(xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
};


