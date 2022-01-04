function Validator(options) {
    var selerctorRules = {}
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage = rule.test(inputElement.value)

            if(errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            }else {
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
            }
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    if(formElement) {
        options.rules.forEach(function(rule) {

            // Luu lai cac rules cua the input
            if(Array.isArray(selerctorRules[rule.selector])) {
                selerctorRules[rule.selector].push(rule.test)
            }else {
                selerctorRules[rule.selector] = rule.test
            }

            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement) {
                // Xu ly truong hop blur ra ngoai
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                inputElement.oninput = function() {
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
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

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function(selector, getComfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getComfirmValue() ? undefined : message ||'Giá trị nhập vào không chính xác'
        }
    }
}