const INITIAL_STATE = {
    id: '',
    username: '',
    password: '',
    email: '',
    role: '',
    cart:[]
}

export const userReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case 'LOG_IN':
            return{
                ...state,
                id : action.payload.id,
                username : action.payload.username,
                password : action.payload.password,
                role : action.payload.role,
                email : action.payload.email,
                cart : action.payload.cart
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        default :
            return state
    }
}

export default userReducer