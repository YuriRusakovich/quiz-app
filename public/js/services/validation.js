function checkValidation(id) {
    const value = document.getElementById(id).value;
    const error = document.getElementById(`${id}_error`);
    const errorNumber = document.getElementById(`${id}_errorNumber`);
    if (value && id.includes('correct') && (value <=0 || value >= 5)) {
        errors.push(`${id}_error`);
        error.style.display = 'none';
        errors = errors.filter(error => error !== `${id}_error`);
        errorNumber.style.display = 'block';
        errorNumber.innerHTML = 'That field should contain 1-4 value.';
    } else if (value && id.includes('correct') && !(value <=0 || value >= 5)) {
        errorNumber.style.display = 'none';
        error.style.display = 'none';
        errors = errors.filter(error => error !== `${id}_error` && error !== `${id}_errorNumber`);
    } else if (!value && id.includes('correct')) {
        errorNumber.style.display = 'none';
        errors = errors.filter(error => error !== `${id}_errorNumber`);
        errors.push(`${id}_error`);
        error.style.display = 'block';
        error.innerHTML = 'That field is required.';
    } else if (value) {
        error.style.display = 'none';
        errors = errors.filter(error => error !== `${id}_error`);
    } else {
        errors.push(`${id}_error`);
        error.style.display = 'block';
        error.innerHTML = 'That field is required.';
    }
}