function Validator(options) {
    var selectorRules = {}
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage;
        
        // Lay ra cac rules cua selector
        var rules = selectorRules[rule.selector]
        // Lap qua tung rule va` kiem ta
        for(var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            // neu co' loi thi` dung`
            if(errorMessage) break;
        }

            if(errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            }else {
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
            }

            return !errorMessage
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    if(formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true

            // Thuc hien lap qua tung rule va` validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false
                }
            })
            
            if(isFormValid) {
                // Truong hop submit voi js
                if(typeof options.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInput).reduce(function(values, input) {
                        values[input.name] = input.value 
                        return values
                    }, {}) 
                    options.onSubmit(formValues)
                }
                // Truong hop submit voi hanh vi mac dinh
                else {
                    formElement.submit()
                }
            }
        }

        // Lap qua moi rule va xu ly (Lang nghe su kien blur, input,...)
        options.rules.forEach(function(rule) {

            // Luu lai cac rules cua the input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test]
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