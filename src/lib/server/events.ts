import { EventEmitter, on } from "events"

export const emitter = new EventEmitter()
emitter.setMaxListeners(0)

type EventType = 'newVote'
const eventString = (type: EventType, id: string) => `${type}:${id}`
export const event = (type: EventType, id: string) => on(emitter, eventString(type, id))
export const emit = (type: EventType, id: string) => emitter.emit(eventString(type, id))

export const liveQuery = <T>(eventType: EventType, id: string, fn: () => T) => async function* () {
	yield await fn()
	for await (const _ of event(eventType, id)) {
		yield await fn()
	}
}
