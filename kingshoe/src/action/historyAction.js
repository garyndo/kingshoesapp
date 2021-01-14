export const getHistory = (data) => {
    return {
        type: 'GET_HISTORY', //harus sama dengan yg ada d history reducer
        payload: data
    }
}
