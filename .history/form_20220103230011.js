function Validator(options) {
    var formElement = document.querySelector(options.form)
    if(formElement) {
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector('.form-message')

            if(inputElement) {
                inputElement.onblur = function() {
                    var errorMessage = rule.test(inputElement.value)

                    if(errorMessage) {
                        errorElement.innerText = errorMessage
                        inputElement.parentElement.classList.add('invalid')
                    }else {
                        errorMessage.innerText = ''
                        inputElement.parentElement.classList.remove('invalid')
                    }
                }
            }
        })
    }
}

Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function() {
            return value.trim() ? undefined : 'Vui lòng nhập trường này!'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function() {
            
        }
    }
}