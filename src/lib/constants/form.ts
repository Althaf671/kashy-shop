// forms
export const INPUT_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    FILE: 'file',
    EMAIL: 'email',
    PASSWORD: 'password',
    DATE: 'date',
    NUMBER: 'number',
    TEL: 'tel',
    HIDDEN: 'hidden'
} as const

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES]

export const FORM_ACTIONS = {
    CREATE_CATEGORY: "?/createCategory",
    CREATE_PRODUCT: "?/createProduct",
    PATCH_CATEGORY: "?/patchCategory",
    PATCH_PRODUCT: "?/patchProduct",
    PATCH_PROFILE: "?/patchProfile",
    LOGOUT: "?/logout",
    LOGOUT_DEVICE: "?/logoutDevice",
    LOGOUT_ALL: "?/logoutAll",
} as const

export type FormAction = typeof FORM_ACTIONS[keyof typeof FORM_ACTIONS]