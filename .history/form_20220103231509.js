function Validator(options) {
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector('.form-message')

            if(errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            }else {
                errorMessage.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
            }
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    if(formElement) {
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector)

            if(inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }
            }
        })
    }
}

Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này!'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}