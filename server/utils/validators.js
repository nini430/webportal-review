export const loginValidator=(values)=>{
    let errors={};
    for(const key in values) {
        console.log(key);
        if(!values[key]) {
            errors[key]=`${key}_empty`
        }
    }
    console.log(errors);

    return {errors,isInvalid:Object.keys(errors).length>0}
}


