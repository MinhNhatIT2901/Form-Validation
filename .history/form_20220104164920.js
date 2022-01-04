// function Validator(options) {
//     function getParent(element, selector) {
//         while(element.parentElement) {
//             if(element.parentElement.matches(selector)) {
//                 return element.parentElement
//             }
//             element = element.parentElement
//         }
//     }
//     var selectorRules = {}
//     // Hàm thực hiện validate
//     function validate(inputElement, rule) {
//         var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
//         var errorMessage;
        
//         // Lay ra cac rules cua selector
//         var rules = selectorRules[rule.selector]
//         // Lap qua tung rule va` kiem ta
//         for(var i = 0; i < rules.length; i++) {
//             errorMessage = rules[i](inputElement.value)
//             // neu co' loi thi` dung`
//             if(errorMessage) break;
//         }

//             if(errorMessage) {
//                 errorElement.innerText = errorMessage
//                 getParent(inputElement, options.formGroupSelector).classList.add('invalid')
//             }else {
//                 errorElement.innerText = ''
//                 getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
//             }

//             return !errorMessage
//     }
    
//     // Lấy element của form cần validate
//     var formElement = document.querySelector(options.form)
//     if(formElement) {
//         formElement.onsubmit = function(e) {
//             e.preventDefault();

//             var isFormValid = true

//             // Thuc hien lap qua tung rule va` validate
//             options.rules.forEach(function(rule) {
//                 var inputElement = formElement.querySelector(rule.selector)
//                 var isValid = validate(inputElement, rule)
//                 if(!isValid) {
//                     isFormValid = false
//                 }
//             })
            
//             if(isFormValid) {
//                 // Truong hop submit voi js
//                 if(typeof options.onSubmit === 'function') {
//                     var enableInput = formElement.querySelectorAll('[name]')
//                     var formValues = Array.from(enableInput).reduce(function(values, input) {
//                         values[input.name] = input.value 
//                         return values
//                     }, {}) 
//                     options.onSubmit(formValues)
//                 }
//                 // Truong hop submit voi hanh vi mac dinh
//                 else {
//                     formElement.submit()
//                 }
//             }
//         }

//         // Lap qua moi rule va xu ly (Lang nghe su kien blur, input,...)
//         options.rules.forEach(function(rule) {

//             // Luu lai cac rules cua the input
//             if(Array.isArray(selectorRules[rule.selector])) {
//                 selectorRules[rule.selector].push(rule.test)
//             }else {
//                 selectorRules[rule.selector] = [rule.test]
//             }

//             var inputElement = formElement.querySelector(rule.selector)
//             if(inputElement) {
//                 // Xu ly truong hop blur ra ngoai
//                 inputElement.onblur = function() {
//                     validate(inputElement, rule)
//                 }

//                 var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
//                 inputElement.oninput = function() {
//                     errorElement.innerText = ''
//                     getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
//                 }
//             }
//         })
//     }
// }

// Validator.isRequired = function(selector) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value.trim() ? undefined : 'Vui lòng nhập trường này!'
//         }
//     }
// }

// Validator.isEmail = function(selector) {
//     return {
//         selector: selector,
//         test: function(value) {
//             var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
//             return regex.test(value) ? undefined : 'Trường này phải là email'
//         }
//     }
// }

// Validator.minLength = function(selector, min) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
//         }
//     }
// }

// Validator.isConfirmed = function(selector, getComfirmValue, message) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value === getComfirmValue() ? undefined : message ||'Giá trị nhập vào không chính xác'
//         }
//     }
// }


function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        
        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
               // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                } 
            });
        });
    }

}



// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined :  message || 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  message || 'Trường này phải là email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined :  message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
