export const makeActionListTimeline = (actionList) => {
    let accumulator = 0

    actionList.forEach(action => {
        if(action.wait === undefined) throw new Error("All actions must have a wait")
        action.timeline = accumulator;
        accumulator += action.wait;
    })

    return actionList;
}