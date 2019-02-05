export default class ContactWrapper{
	constructor(url, lang) {
		this.url = url;
		this.lang = lang;
		this.user = {
			firstname: '',
			lastname: '',
			email: '',
			mobile: '',
			note: '',
			anreise: '',
			abreise: '',
			interest: '',
			validation: false
		};
	}

	/**
	 *
	 * @param e
	 */
	updateUser(e) {
		if(e.target.name === 'anreise'){
			this.user.anreise = e.target.value.split(' to ')[0];
			this.user.abreise = e.target.value.split(' to ')[1];
			return;
		}
		this.user[e.target.name] = e.target.value;
	}

	/**
	 *
	 * @param e
	 */
	updateDSGVO(e) {
		if(e.target.checked) {
			this.user.validation = true
		}else{
			this.user.validation = false
		}
	}

	/**
	 *
	 * @returns {boolean}
	 */
	validation() {
		if(!this.user.firstname){
			return false;
		}

		if(!this.user.lastname){
			return false;
		}

		if(!this.user.mobile){
			return false;
		}

		if(!this.user.email){
			return false;
		}

		if(!this.user.note){
			return false;
		}

		return true;
	}

	/**
	 *
	 * @param e
	 * @param form
	 */
	submit(e, form, lang) {
		if(this.validation()){
			this.submitForm(form, lang);
		}
	}

	/**
	 *
	 */
	submitForm(form, lang) {
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Wir haben deine Email erhalten.';
		form.querySelector('button .loading').style.display = 'inline-block';

		if(this.user.validation) {
			/**
			 * create new contact
			 */
			fetch(this.url + '?method=create_new_contact', {
				method: 'POST',
				body: JSON.stringify({
					firstname: this.user.firstname,
					lastname: this.user.lastname,
					mobile: this.user.mobile,
					email: this.user.email,
					note: this.user.note,
					anreise: this.user.anreise,
					abreise: this.user.abreise,
					shorttext: this.user.interest ? 'Interesse: ' + this.user.interest : 'Frontendbuchung',
					longtext: this.user.note,
				})
			}).then((response) => {
				return response.json();
			}).then((response) => {
				this.reset(form);
			})
		}
	}

	/**
	 *
	 * @param form
	 */
	reset(form) {
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Wir haben deine Email erhalten.';

		setTimeout(() => {

			this.user = {
				firstname: '',
				lastname: '',
				email: '',
				mobile: '',
				note: '',
				anreise: '',
				abreise: '',
				interest: '',
				validation: false
			};
			this.selectedCourses = {};
			this.current = 'course';

			form.querySelector('button').disabled = true;
			form.querySelector('button .loading').style.display = 'none';
			form.querySelector('button').style.backgroundColor = 'limegreen';

		}, 2000);

	}
}