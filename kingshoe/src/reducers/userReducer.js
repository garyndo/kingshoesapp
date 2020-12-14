const INITIAL_STATE = {
    id: '',
    username: '',
    email: '',
    role: ''
}

export const userReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case 'LOG_IN':
            return{
                ...state,
                id : action.payload.id,
                username : action.payload.username,
                role : action.payload.role,
                email : action.payload.email
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        default :
            return state
    }
}

export default userReducer