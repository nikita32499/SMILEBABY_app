import { store } from "../store/store";
import { initialState } from "../store/items/items.slice";





export function FilterIsDefault(){
    let current_filter = store.getState().items.filter

    return !current_filter.modified
}