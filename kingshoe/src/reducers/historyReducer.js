// const INITIAL_STATE = []

// export const historyReducer = (state = INITIAL_STATE, )
export const historyReducer = (state = [], action) => {
    switch(action.type){
        case 'GET_HISTORY':
            return action.payload //karna bentuk datanya array jadi ga usah pake titik apa gt kaya d user reducer
        default:
            return state    
    }
}