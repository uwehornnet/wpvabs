const $ = require('jquery');



const trigger_one = document.querySelectorAll('input[name="page"]');
const step_two = document.getElementById('step_two');
const last_step = document.getElementById('last_step');
const final = document.getElementById('final');
const output_element = document.getElementById('vabs_shortcode_output_element');

const languages = document.querySelector('.vabs__formlist');
const langNav = document.querySelector('.navigation__links');
const links = document.querySelectorAll('.navigation__links--link');
if(languages){
	languages.firstElementChild.classList.add('active');
}

if(langNav) {
	langNav.firstElementChild.classList.add('active');
}

if(links) {
	for(var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function() {
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

const url = vabs_ajax_obj.url + 'handler.php';

let outputData = {
	id: null,
	type: null,
	lang: null
};

document.getElementById('generate_custom_vabs_shortcode').addEventListener('click', output);

for(var i = 0; i < trigger_one.length; i++){
	trigger_one[i].addEventListener('change', changeStep)
}

$('.from__field--radio--lang').each(function() {
	this.addEventListener('change', function() {
		outputData.lang = this.value;
	});
});

function output() {
	output_element.value = '[vabs_booking type="' + outputData.type + '" id="' + outputData.id + '" lang="' + outputData.lang + '"]';
}

function changeStep() {
	step_two.style.maxHeight = '0px';
	last_step.style.maxHeight = '0px';
	final.style.maxHeight = '0px';

	clearStep($('#step_two label'));
	clearStep($('#last_step label'));

	if(this.value === 'detail') {
		outputData.type = 'course';
		getAllCourses()
	}

	if(this.value === 'allgemein') {
		outputData.type = 'coursegroup';
		getCourseGroups()
	}
}

function finalStep() {
	outputData.id = this.value;
	openElement(final);
}

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

function getAllCourses() {
	const value = ApiCall('get_all_courses', {});
	appendElements(last_step, JSON.parse(value));
	openElement(last_step);
}

function getCourseGroups() {
	const value = ApiCall('get_all_course_groups', {});
	appendElements(step_two, JSON.parse(value));
	openElement(step_two);
}

function appendElements(element, data) {
	for(var i = 0; i < data.length; i++){
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

function openElement(element) {
	element.style.maxHeight = element.scrollHeight + 'px';
}

function clearStep(step) {
	if(step) {
		step.each(function() {
			this.remove();
		});
	}
}


