import VabsWrapper from './components/vabswrapper.js';
new VabsWrapper(document.querySelectorAll('.vabs-api-form'), vabs_obj.ajax_url + 'handler.php', vabs_obj.lang);