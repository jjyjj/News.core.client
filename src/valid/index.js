// 用户名验证
export let nameValid = [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ]
    // 密码验证
export let passwordValid = [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ]
    // 手机号验证(自定义)
export let mobileValid = [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                // 验证手机号的正则表达式
                let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return callback()
                }
                callback(new Error('请输入合法手机号'))
            },
            trigger: 'blur'
        }
    ]
    // 邮箱验证(自定义)
export let emailValid = [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
        validator: (rule, value, callback) => {
            // 验证邮箱的正则表达式
            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法邮箱'))
        },
        trigger: 'blur'
    }
]
export let emailValidFalse = [
        { message: '请输入邮箱', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                // 验证邮箱的正则表达式
                let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return callback()
                }
                callback(new Error('请输入合法邮箱'))
            },
            trigger: 'blur'
        }
    ]
    // 密码验证
export let isRequire = [
        { required: true, message: '内容不可为空', trigger: 'blur' },

    ]
    // 确认密码
export let checkPass = [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.ruleForm.newPass) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ] // 文章标题
export let titleValid = [
    { required: true, message: '请输入标题', trigger: 'blur' },

]

// 类别
export let categorysValid = [
    { type: 'array', required: true, message: '请至少选择一个类别', trigger: 'change' }

]